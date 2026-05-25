import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { updateAttentionItem } from "@/attentionItems/apis/updateAttentionItem";
import type {
  AttentionItemDto,
  AttentionItemUpdateInput,
} from "@/attentionItems/models/attentionItem";
import { useAttentionItemsQueryData } from "../queries/useAttentionItemsQueryData";

export function useUpdateAttentionItem() {
  const { queryKey } = useAttentionItemsQueryData();
  return useOptimisticMutation<AttentionItemDto[], AttentionItemUpdateInput>({
    queryKey,
    mutationFn: updateAttentionItem,
    updater: updateOptimistic,
    skipInvalidateOnSuccess: true,
  });
}

function updateOptimistic(
  previous: AttentionItemDto[] | undefined,
  input: AttentionItemUpdateInput,
): AttentionItemDto[] {
  if (!previous) return [];
  return previous.map((item) =>
    item.id === input.id
      ? {
          ...item,
          status: input.status ?? item.status,
          note: input.note !== undefined ? input.note : item.note,
          tagIds: input.tagIds ?? item.tagIds,
        }
      : item,
  );
}
