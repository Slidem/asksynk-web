import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { updateAttentionItemSourceStatus } from "@/attentionItems/apis/updateAttentionItemSourceStatus";
import type {
  AttentionItemDto,
  AttentionItemStatus,
} from "@/attentionItems/models/attentionItem";
import { useAttentionItemsQueryData } from "../queries/useAttentionItemsQueryData";

interface UpdateAttentionItemStatusInput {
  item: AttentionItemDto;
  status: AttentionItemStatus;
}

// Optimistic flip on the item; `attention.upserted` reconciles once the
// source change propagates server-side.
export function useUpdateAttentionItemStatus() {
  const queryClient = useQueryClient();
  const { queryKey } = useAttentionItemsQueryData();
  const mutation = useOptimisticMutation<
    AttentionItemDto[],
    UpdateAttentionItemStatusInput
  >({
    queryKey,
    mutationFn: ({ item, status }) =>
      updateAttentionItemSourceStatus(item, status).catch((error) => {
        notifications.show({
          color: "red",
          title: "Could not update status",
          message: error instanceof Error ? error.message : "Please try again",
        });
        throw error;
      }),
    updater: (previous, { item, status }) =>
      (previous ?? []).map((i) => (i.id === item.id ? { ...i, status } : i)),
    skipInvalidateOnSuccess: true,
    onSuccess: (_data, { item }) => {
      if (item.source.kind === "task") {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    },
  });

  return { updateStatus: mutation.mutate, isUpdating: mutation.isPending };
}
