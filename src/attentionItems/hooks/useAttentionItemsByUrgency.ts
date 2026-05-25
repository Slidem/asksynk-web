import { useMemo } from "react";

import { useAttentionItems } from "@/attentionItems/hooks/queries/useAttentionItems";
import { useCurrentTimeblock } from "@/attentionItems/hooks/useCurrentTimeblock";
import { useTagAnswerModeMap } from "@/attentionItems/hooks/useTagAnswerModeMap";
import { useAttentionItemsSearchStore } from "@/attentionItems/store/attentionItemsSearchStore";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { AttentionUrgency } from "@/attentionItems/models/urgency";
import { URGENCY_ORDER } from "@/attentionItems/models/urgency";
import { computeUrgency } from "@/attentionItems/utils/computeUrgency";
import { filterAttentionItemsByQuery } from "@/attentionItems/utils/filterAttentionItemsByQuery";

export type AttentionItemsByUrgency = Record<AttentionUrgency, AttentionItemDto[]>;

export function useAttentionItemsByUrgency() {
  const { data: items, isLoading, isError } = useAttentionItems();
  const currentTimeblock = useCurrentTimeblock();
  const tagAnswerModes = useTagAnswerModeMap();
  const query = useAttentionItemsSearchStore((s) => s.query);

  const grouped = useMemo<AttentionItemsByUrgency>(() => {
    const empty = emptyBuckets();
    if (!items) return empty;

    const filtered = filterAttentionItemsByQuery(items, query);
    const ctx = {
      now: new Date(),
      currentTimeblockTagIds: new Set(currentTimeblock?.tagIds ?? []),
      tagAnswerModes,
    };

    for (const item of filtered) {
      const urgency = computeUrgency(item, ctx);
      empty[urgency].push(item);
    }
    return empty;
  }, [items, query, currentTimeblock, tagAnswerModes]);

  return { grouped, order: URGENCY_ORDER, isLoading, isError };
}

function emptyBuckets(): AttentionItemsByUrgency {
  return URGENCY_ORDER.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as AttentionItemsByUrgency);
}
