import { deleteTaskSuggestion } from "@/tasks/apis/deleteTaskSuggestion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRescindTaskSuggestion() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteTaskSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-suggestions"] });
    },
  });

  return { rescind: mutation.mutate, isRescinding: mutation.isPending };
}
