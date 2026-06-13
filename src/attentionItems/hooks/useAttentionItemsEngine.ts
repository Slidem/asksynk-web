import { connectMessageSocket } from "@/messages/socket/messageSocket";
import { useSession } from "@/auth";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { useTagAnswerModeMap } from "@/attentionItems/hooks/useTagAnswerModeMap";
import { playNotificationSound, preloadNotificationSound } from "@/attentionItems/sounds/attentionSoundPlayer";
import { findCurrentTimeblock, todayRange } from "@/attentionItems/utils/currentTimeblock";
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
 * Single global engine for incoming attention items: listens for the
 * `attention.created` socket event and prepends the item to the list cache so
 * the dashboard updates live. Alerts are gated by `shouldNotifyAttentionItem`
 * (urgent tags always; timeblock tags only when in the active timeblock), then
 * fired via the most-permissive browser/sound settings across the item's tags.
 */
export function useAttentionItemsEngine() {
  const queryClient = useQueryClient();
  const { data: tagMap } = useUserTags(undefined, buildTagMap);
  const tagAnswerModes = useTagAnswerModeMap();

  // Today's events drive the "current timeblock" gate; same query key as the
  // dashboard's useCurrentTimeblock → deduped, no extra fetch.
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

    const handleCreated = ({ item }: { item: AttentionItemDto }) => {
      prependToCaches(item);

      // Timing gate: urgent tags alert immediately; timeblock tags only when
      // the item fits the active timeblock. Otherwise insert-only (no alert).
      const now = new Date();
      const currentBlock = findCurrentTimeblock(eventsRef.current, now);
      const shouldNotify = shouldNotifyAttentionItem(item, {
        now,
        currentTimeblockTagIds: new Set(currentBlock?.tagIds ?? []),
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

    function prependToCaches(item: AttentionItemDto) {
      queryClient.setQueriesData<AttentionItemDto[]>(
        { queryKey: [ATTENTION_ITEMS_KEY_PREFIX] },
        (current) => {
          if (!current) return current;
          if (current.some((i) => i.id === item.id)) return current;
          return [item, ...current];
        },
      );
    }

    // Status/field change on an existing item (e.g. a task moved to
    // in_progress/resolved, or a suggestion accepted). Resolved items are
    // terminal → drop them from the active inbox; otherwise replace in place.
    // Silent: no re-alert on update.
    const handleUpdated = ({ item }: { item: AttentionItemDto }) => {
      queryClient.setQueriesData<AttentionItemDto[]>(
        { queryKey: [ATTENTION_ITEMS_KEY_PREFIX] },
        (current) => {
          if (!current) return current;
          if (item.status === "resolved") {
            return current.filter((i) => i.id !== item.id);
          }
          return current.map((i) => (i.id === item.id ? item : i));
        },
      );
    };

    socket.on("attention.created", handleCreated);
    socket.on("attention.updated", handleUpdated);
    return () => {
      socket.off("attention.created", handleCreated);
      socket.off("attention.updated", handleUpdated);
    };
  }, [queryClient]);
}
