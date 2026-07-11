import { connectMessageSocket } from "@/messages/socket/messageSocket";
import { useSession } from "@/auth";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { useTagAnswerModeMap } from "@/attentionItems/hooks/useTagAnswerModeMap";
import {
  playNotificationSound,
  preloadNotificationSound,
} from "@/attentionItems/sounds/attentionSoundPlayer";
import {
  findCurrentTimeblocks,
  todayRange,
} from "@/attentionItems/utils/currentTimeblock";
import { formatAttentionItemNotification } from "@/attentionItems/utils/formatAttentionItemNotification";
import { mergeTagNotificationSettings } from "@/attentionItems/utils/mergeTagNotificationSettings";
import { shouldNotifyAttentionItem } from "@/attentionItems/utils/tagModePredicates";
import { showBrowserNotification } from "@/lib/browserNotification";
import { useUserCalendarEvents } from "@/schedule/hooks/queries/useUserCalendarEvents";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import { useUserTags } from "@/tags/hooks/queries/useUserTags";
import type { TagAnswerMode, TagDto } from "@/tags/models/tag";
import { useQueryClient } from "@tanstack/react-query";
import { IconBell } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { createElement, useEffect, useMemo, useRef } from "react";

const ATTENTION_ITEMS_KEY_PREFIX = "attention-items";

function buildTagMap(tags: TagDto[]): Map<string, TagDto> {
  return new Map(tags.map((t) => [t.id, t]));
}

/**
 * Single global engine for incoming attention items. Attention items are
 * eventually consistent: task/batch/suggestion REST calls return before the
 * item exists, then it lands via socket. `attention.upserted` covers create
 * and update (keyed by id) — we upsert it into the list cache so the dashboard
 * updates live; `attention.removed` drops it by id. Alerts fire only the first
 * time we see an item (updates are silent), gated by `shouldNotifyAttentionItem`
 * (urgent tags always; timeblock tags only when in the active timeblock), then
 * via the most-permissive browser/sound settings across the item's tags.
 */
export function useAttentionItemsEngine() {
  const queryClient = useQueryClient();
  const { data: tagMap } = useUserTags(undefined, buildTagMap);
  const tagAnswerModes = useTagAnswerModeMap();

  // Today's events drive the "current timeblock" gate; same query key as the
  // dashboard's useCurrentTimeblocks → deduped, no extra fetch.
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const range = useMemo(() => todayRange(), []);
  const { data: events } = useUserCalendarEvents(
    userId ?? "",
    userId ? range : null,
  );

  // Latest values read inside the socket closure without re-subscribing.
  const tagMapRef = useRef<Map<string, TagDto>>(new Map());
  const tagAnswerModesRef = useRef<Map<string, TagAnswerMode>>(new Map());
  const eventsRef = useRef<CalendarEvent[]>([]);
  useEffect(() => {
    tagMapRef.current = tagMap ?? new Map();
  }, [tagMap]);
  useEffect(() => {
    tagAnswerModesRef.current = tagAnswerModes;
  }, [tagAnswerModes]);
  useEffect(() => {
    eventsRef.current = events ?? [];
  }, [events]);

  useEffect(() => {
    preloadNotificationSound();
  }, []);

  useEffect(() => {
    const socket = connectMessageSocket();

    const handleUpserted = ({ item }: { item: AttentionItemDto }) => {
      const isNew = upsertIntoCaches(item);

      // Alert only on first appearance; updates (re-upserts) and resolved
      // (terminal) items are silent.
      if (!isNew || item.status === "resolved") return;

      // Timing gate: urgent tags alert immediately; timeblock tags only when
      // the item fits the active timeblock. Otherwise insert-only (no alert).
      const now = new Date();
      const currentBlocks = findCurrentTimeblocks(eventsRef.current, now);
      const shouldNotify = shouldNotifyAttentionItem(item, {
        now,
        currentTimeblockTagIds: new Set(
          currentBlocks.flatMap((b) => b.tagIds ?? []),
        ),
        currentTimeblocks: currentBlocks,
        tagAnswerModes: tagAnswerModesRef.current,
      });
      if (!shouldNotify) return;

      const tags = item.tagIds
        .map((id) => tagMapRef.current.get(id))
        .filter((t): t is TagDto => Boolean(t));
      const settings = mergeTagNotificationSettings(tags);

      if (settings.browserNotificationEnabled) {
        const { title, body } = formatAttentionItemNotification(item);
        notifications.show({
          title,
          message: body,
          icon: createElement(IconBell, { size: 18 }),
          autoClose: 6000,
        });
        if (document.hidden) {
          showBrowserNotification({ title, body });
        }
      }

      if (settings.soundNotificationEnabled) {
        playNotificationSound();
      }
    };

    // Upsert by id: replace in place if present, else prepend. Resolved items
    // stay in the cache (they surface in the "Resolved" bucket); removal is a
    // separate `attention.removed` event. Returns true if newly inserted.
    function upsertIntoCaches(item: AttentionItemDto): boolean {
      let inserted = false;
      queryClient.setQueriesData<AttentionItemDto[]>(
        { queryKey: [ATTENTION_ITEMS_KEY_PREFIX] },
        (current) => {
          if (!current) return current;
          const idx = current.findIndex((i) => i.id === item.id);
          if (idx === -1) {
            inserted = true;
            return [item, ...current];
          }
          const next = [...current];
          next[idx] = item;
          return next;
        },
      );
      return inserted;
    }

    // Item deleted/rescinded server-side (e.g. task or suggestion removed).
    const handleRemoved = ({ id }: { id: string }) => {
      queryClient.setQueriesData<AttentionItemDto[]>(
        { queryKey: [ATTENTION_ITEMS_KEY_PREFIX] },
        (current) => (current ? current.filter((i) => i.id !== id) : current),
      );
    };

    socket.on("attention.upserted", handleUpserted);
    socket.on("attention.removed", handleRemoved);
    return () => {
      socket.off("attention.upserted", handleUpserted);
      socket.off("attention.removed", handleRemoved);
    };
  }, [queryClient]);
}
