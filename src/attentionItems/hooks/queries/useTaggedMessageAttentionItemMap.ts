import { useAttentionItems } from "@/attentionItems/hooks/queries/useAttentionItems";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";

const EMPTY = new Map<string, AttentionItemDto>();

// Stable module-level selector → TanStack only re-runs it when the underlying
// ['attention-items'] data actually changes (no per-render churn). Reuses the
// canonical query key, so the dashboard, the socket upserts and the optimistic
// status mutation all reflect into the same cache, both ways.
function selectTaggedByMessageId(
  items: AttentionItemDto[],
): Map<string, AttentionItemDto> {
  const map = new Map<string, AttentionItemDto>();
  for (const item of items) {
    if (item.metadata.type === "tagged_message") {
      map.set(item.metadata.messageId, item);
    }
  }
  return map;
}

// Tagged-message attention items keyed by their source messageId, so a message
// bubble can show + control its status. Mounting this on the messages route also
// SEEDS the shared cache (the dashboard isn't the only fetcher; the socket can't
// self-heal an empty cache). Only the item OWNER has these in cache, so presence
// in the map is itself the ownership/visibility gate.
export function useTaggedMessageAttentionItemMap(): Map<string, AttentionItemDto> {
  const { data } = useAttentionItems(selectTaggedByMessageId);
  return data ?? EMPTY;
}
