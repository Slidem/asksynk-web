import { apiFetch, buildApiUrl } from "@/lib/api";

import type { TagDto } from "@/tags/models/tag";
import type { TagsFilters } from "@/tags/models/filters";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTagsFilters } from "./filters";

export function tagsQueryKey(filters: TagsFilters) {
  return ["tags", filters] as const;
}

export const useFilteredTagsQueryData = () => {
  const filters = useTagsFilters();
  const queryKey = useMemo(() => tagsQueryKey(filters), [filters]);
  return { filters, queryKey };
};

export function useFilteredTags<T>(select?: (data: TagDto[]) => T) {
  const { filters, queryKey } = useFilteredTagsQueryData();
  return useQuery({
    queryKey,
    queryFn: () => fetchFilteredTags(filters),
    placeholderData: [],
    select,
  });
}

export const useFilteredTagsCount = () => {
  const { data: tagCount } = useFilteredTags((tags) => tags.length);
  return tagCount ?? 0;
};

async function fetchFilteredTags(filters: TagsFilters): Promise<TagDto[]> {
  const response = await apiFetch(getTagsUrl(filters));

  if (!response.ok) {
    throw new Error("Failed to load tags");
  }

  return response.json();
}

function getTagsUrl(filters: TagsFilters) {
  const params = new URLSearchParams();

  if (filters.answerMode && filters.answerMode !== "all") {
    params.set("answerMode", filters.answerMode);
  }

  if (filters.orderBy) {
    params.set("orderBy", filters.orderBy);
  }

  if (filters.orderDirection) {
    params.set("orderDirection", filters.orderDirection);
  }

  if (filters.search && filters.search.trim().length >= 3) {
    params.set("search", filters.search.trim());
  }

  if (typeof filters.limit === "number") {
    params.set("limit", String(filters.limit));
  }

  if (typeof filters.offset === "number") {
    params.set("offset", String(filters.offset));
  }

  const suffix = params.toString();

  return buildApiUrl(`/tags${suffix ? `?${suffix}` : ""}`);
}
