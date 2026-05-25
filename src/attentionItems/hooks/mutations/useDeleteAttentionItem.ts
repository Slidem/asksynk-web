import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { deleteAttentionItem } from "@/attentionItems/apis/deleteAttentionItem";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { useAttentionItemsQueryData } from "../queries/useAttentionItemsQueryData";

export function useDeleteAttentionItem() {
  const { queryKey } = useAttentionItemsQueryData();
  return useOptimisticMutation<AttentionItemDto[], string>({
    queryKey,
    mutationFn: deleteAttentionItem,
    updater: removeOptimistic,
    skipInvalidateOnSuccess: true,
  });
}

function removeOptimistic(
  previous: AttentionItemDto[] | undefined,
  id: string,
): AttentionItemDto[] {
  if (!previous) return [];
  return previous.filter((item) => item.id !== id);
}
