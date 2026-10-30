import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { htmlToPreview } from "@/lib/htmlToPreview";

// Message titles are a cut of the TipTap HTML body → strip tags.
export function getAttentionItemTitle(item: AttentionItemDto): string {
  return htmlToPreview(item.preview.title, 80) || "Attention item";
}
