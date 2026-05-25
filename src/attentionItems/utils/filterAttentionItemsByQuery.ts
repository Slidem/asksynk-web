import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { getAttentionItemConfig } from "@/attentionItems/components/attentionItemTypeRegistry";

export function filterAttentionItemsByQuery(
  items: AttentionItemDto[],
  query: string,
): AttentionItemDto[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) => {
    const { getDisplayTitle } = getAttentionItemConfig(item.metadata.type);
    return getDisplayTitle(item.metadata).toLowerCase().includes(q);
  });
}
