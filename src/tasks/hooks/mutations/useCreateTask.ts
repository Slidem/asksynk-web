import { createTask } from "@/tasks/apis/createTask";
import type { TaskCreateInput } from "@/tasks/models/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTask() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: TaskCreateInput) => createTask(input),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (input.batchId) {
        // Batch detail embeds its tasks; keep it in sync.
        queryClient.invalidateQueries({ queryKey: ["task-batches"] });
      }
    },
  });

  return { createTask: mutation.mutate, isCreating: mutation.isPending };
}
