import type { TagAnswerMode, TagDto } from "@/tags/models/tag";
import { apiFetch, buildApiUrl } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface TagsFilters {
  answerMode?: TagAnswerMode | "all";
  orderBy?: "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
  search?: string;
  limit?: number;
  offset?: number;
}

export function tagsQueryKey(filters: TagsFilters) {
  return ["tags", filters] as const;
}

function getTagsUrl(filters: TagsFilters) {
  const params = new URLSearchParams();

  if (filters.answerMode && filters.answerMode !== "all") {
    params.set("answerMode", filters.answerMode);
  }

  if (filters.orderBy) params.set("orderBy", filters.orderBy);
  if (filters.orderDirection)
    params.set("orderDirection", filters.orderDirection);

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

async function fetchTags(filters: TagsFilters): Promise<TagDto[]> {
  const response = await apiFetch(getTagsUrl(filters));

  if (!response.ok) {
    throw new Error("Failed to load tags");
  }

  return response.json();
}

export function useTagsQuery(filters: TagsFilters) {
  return useQuery({
    queryKey: tagsQueryKey(filters),
    queryFn: () => fetchTags(filters),
  });
}
