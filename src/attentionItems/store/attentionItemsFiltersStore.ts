import { create } from "zustand";

import type { AttentionUrgency } from "@/attentionItems/models/urgency";

const DEFAULT_VISIBLE_BUCKETS: AttentionUrgency[] = [
  "overdue",
  "urgent",
  "now",
  "upcoming",
  "later",
];

interface Props {
  visibleBuckets: AttentionUrgency[];
  setVisibleBuckets: (buckets: AttentionUrgency[]) => void;
  toggleBucket: (bucket: AttentionUrgency) => void;
}

export const useAttentionItemsFiltersStore = create<Props>((set) => ({
  visibleBuckets: DEFAULT_VISIBLE_BUCKETS,
  setVisibleBuckets: (visibleBuckets) => set({ visibleBuckets }),
  toggleBucket: (bucket) =>
    set((state) => ({
      visibleBuckets: state.visibleBuckets.includes(bucket)
        ? state.visibleBuckets.filter((b) => b !== bucket)
        : [...state.visibleBuckets, bucket],
    })),
}));
