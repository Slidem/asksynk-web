import { updateTaskBatch } from "@/tasks/apis/updateTaskBatch";
import { getTaskBatchQueryKey } from "@/tasks/hooks/queries/useTaskBatchQueryData";
import type { TaskBatchUpdateInput } from "@/tasks/models/taskBatch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTaskBatch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: TaskBatchUpdateInput) => updateTaskBatch(input),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: getTaskBatchQueryKey(input.id),
      });
    },
  });

  return { updateTaskBatch: mutation.mutate, isUpdating: mutation.isPending };
}
