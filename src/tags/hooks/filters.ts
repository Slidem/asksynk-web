import { useTagsFiltersStore } from "../store/tagsFiltersStore";

export const useTagsFilters = () => {
  return useTagsFiltersStore((state) => state.filters);
};

export const useTagsFilter = <
  K extends keyof ReturnType<typeof useTagsFilters>,
>(
  key: K,
) => {
  return useTagsFiltersStore((state) => state.filters[key]);
};

export const useUpdateTagFilter = () =>
  useTagsFiltersStore((state) => state.setFilter);
