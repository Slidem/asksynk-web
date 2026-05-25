import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  AttentionItemDto,
  AttentionItemListFilters,
} from "@/attentionItems/models/attentionItem";

export async function fetchAttentionItems(
  filters: AttentionItemListFilters = {},
): Promise<AttentionItemDto[]> {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.cursor) params.set("cursor", filters.cursor);
  if (typeof filters.limit === "number") {
    params.set("limit", String(filters.limit));
  }

  const suffix = params.toString();
  const response = await apiFetch(
    buildApiUrl(`/attention-items${suffix ? `?${suffix}` : ""}`),
  );

  if (!response.ok) {
    throw new Error("Failed to load attention items");
  }

  return response.json();
}
