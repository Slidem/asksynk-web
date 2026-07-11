import { useMemo } from "react";

import { useAttentionItems } from "@/attentionItems/hooks/queries/useAttentionItems";
import { useCurrentTimeblocks } from "@/attentionItems/hooks/useCurrentTimeblocks";
import { useTagAnswerModeMap } from "@/attentionItems/hooks/useTagAnswerModeMap";
import { useAttentionItemsSearchStore } from "@/attentionItems/store/attentionItemsSearchStore";
import { useNow } from "@/lib/useNow";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { AttentionUrgency } from "@/attentionItems/models/urgency";
import { URGENCY_ORDER } from "@/attentionItems/models/urgency";
import { computeUrgency } from "@/attentionItems/utils/computeUrgency";
import { filterAttentionItemsByQuery } from "@/attentionItems/utils/filterAttentionItemsByQuery";

export type AttentionItemsByUrgency = Record<
  AttentionUrgency,
  AttentionItemDto[]
>;

const TICK_MS = 30_000;

export function useAttentionItemsByUrgency() {
  const { data: items, isLoading, isError } = useAttentionItems();
  const currentTimeblocks = useCurrentTimeblocks();
  const tagAnswerModes = useTagAnswerModeMap();
  const query = useAttentionItemsSearchStore((s) => s.query);
  const now = useNow(TICK_MS);

  const grouped = useMemo<AttentionItemsByUrgency>(() => {
    const empty = emptyBuckets();
    if (!items) return empty;

    const filtered = filterAttentionItemsByQuery(items, query);
    const ctx = {
      now,
      currentTimeblockTagIds: new Set(
        currentTimeblocks.flatMap((b) => b.tagIds ?? []),
      ),
      currentTimeblocks,
      tagAnswerModes,
    };

    for (const item of filtered) {
      const urgency = computeUrgency(item, ctx);
      empty[urgency].push(item);
    }
    return empty;
  }, [items, query, currentTimeblocks, tagAnswerModes, now]);

  return { grouped, order: URGENCY_ORDER, isLoading, isError };
}

function emptyBuckets(): AttentionItemsByUrgency {
  return URGENCY_ORDER.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as AttentionItemsByUrgency);
}
