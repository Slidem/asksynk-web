import { apiFetch, buildApiUrl } from "@/lib/api";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";

export async function fetchAttentionItem(id: string): Promise<AttentionItemDto> {
  const response = await apiFetch(buildApiUrl(`/attention-items/${id}`));

  if (!response.ok) {
    throw new Error("Failed to load attention item");
  }

  return response.json();
}
