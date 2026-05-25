import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  AttentionItemDto,
  AttentionItemUpdateInput,
} from "@/attentionItems/models/attentionItem";

export async function updateAttentionItem(
  input: AttentionItemUpdateInput,
): Promise<AttentionItemDto> {
  const response = await apiFetch(
    buildApiUrl(`/attention-items/${input.id}`),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: input.status,
        note: input.note,
        tagIds: input.tagIds,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update attention item");
  }

  return response.json();
}
