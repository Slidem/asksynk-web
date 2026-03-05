import { DEFAULT_FILTERS, type TagsFilters } from "@/tags/models/filters";
import { create } from "zustand";

interface Props {
  filters: TagsFilters;
  setFilters: (filters: TagsFilters) => void;
  setFilter: <K extends keyof TagsFilters>(
    key: K,
    value: TagsFilters[K],
  ) => void;
}

export const useTagsFiltersStore = create<Props>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (filters) => set({ filters }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
}));
