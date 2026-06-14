import { deleteTaskBatch } from "@/tasks/apis/deleteTaskBatch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Deleting a batch cascades to its child tasks, so invalidate both lists.
export function useDeleteTaskBatch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteTaskBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-batches"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return { deleteTaskBatch: mutation.mutate, isDeleting: mutation.isPending };
}
