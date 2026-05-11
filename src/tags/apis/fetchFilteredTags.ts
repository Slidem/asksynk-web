import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TagsFilters } from "../models/filters";
import type { TagDto } from "../models/tag";

export async function fetchFilteredTags(
  filters: TagsFilters,
): Promise<TagDto[]> {
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

  if (filters.userId) {
    params.set("userId", filters.userId);
  }

  const suffix = params.toString();

  return buildApiUrl(`/tags${suffix ? `?${suffix}` : ""}`);
}
