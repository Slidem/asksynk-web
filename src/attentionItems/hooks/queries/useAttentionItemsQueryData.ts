import { useMemo } from "react";
import type { AttentionItemListFilters } from "@/attentionItems/models/attentionItem";

const EMPTY_FILTERS: AttentionItemListFilters = {};

export function getAttentionItemsQueryKey(
  filters: AttentionItemListFilters = EMPTY_FILTERS,
) {
  return ["attention-items", filters] as const;
}

export function useAttentionItemsQueryData() {
  const queryKey = useMemo(
    () => getAttentionItemsQueryKey(EMPTY_FILTERS),
    [],
  );
  return { filters: EMPTY_FILTERS, queryKey };
}
