import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { getAttentionItemTitle } from "@/attentionItems/utils/getAttentionItemTitle";

export function filterAttentionItemsByQuery(
  items: AttentionItemDto[],
  query: string,
): AttentionItemDto[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) =>
    getAttentionItemTitle(item).toLowerCase().includes(q),
  );
}
