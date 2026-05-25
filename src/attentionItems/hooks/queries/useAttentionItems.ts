import { useQuery } from "@tanstack/react-query";
import { fetchAttentionItems } from "@/attentionItems/apis/fetchAttentionItems";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { useAttentionItemsQueryData } from "./useAttentionItemsQueryData";

export function useAttentionItems<T = AttentionItemDto[]>(
  selectFn?: (data: AttentionItemDto[]) => T,
) {
  const { filters, queryKey } = useAttentionItemsQueryData();
  return useQuery({
    queryKey,
    queryFn: () => fetchAttentionItems(filters),
    placeholderData: [],
    select: selectFn,
  });
}
