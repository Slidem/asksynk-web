import { createTaskBatch } from "@/tasks/apis/createTaskBatch";
import type { TaskBatchCreateInput } from "@/tasks/models/taskBatch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// A batch fans out tasks across assignees/scopes, so invalidate both the batch
// list and the task lists.
export function useCreateTaskBatch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: TaskBatchCreateInput) => createTaskBatch(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-batches"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return { createTaskBatch: mutation.mutate, isCreating: mutation.isPending };
}
