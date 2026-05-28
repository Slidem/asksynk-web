import { useAttentionItemsFiltersStore } from "@/attentionItems/store/attentionItemsFiltersStore";

export const useVisibleAttentionBuckets = () =>
  useAttentionItemsFiltersStore((s) => s.visibleBuckets);

export const useSetVisibleAttentionBuckets = () =>
  useAttentionItemsFiltersStore((s) => s.setVisibleBuckets);

export const useToggleAttentionBucket = () =>
  useAttentionItemsFiltersStore((s) => s.toggleBucket);
