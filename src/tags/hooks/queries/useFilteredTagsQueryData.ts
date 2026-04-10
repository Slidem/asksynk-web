import type { TagsFilters } from "@/tags/models/filters";
import { useMemo } from "react";
import { useTagsFilters } from "../filters";

export const useFilteredTagsQueryData = () => {
  const filters = useTagsFilters();
  const queryKey = useMemo(() => getFilteredTagsQueryKey(filters), [filters]);
  return { filters: filters, queryKey };
};

export function getFilteredTagsQueryKey(filters: TagsFilters) {
  return ["tags", filters] as const;
}
