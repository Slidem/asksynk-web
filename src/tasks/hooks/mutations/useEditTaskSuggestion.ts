import { updateTaskSuggestion } from "@/tasks/apis/updateTaskSuggestion";
import type { TaskSuggestionPayloadEditInput } from "@/tasks/models/taskSuggestion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Payload-edit mode of the suggestion PATCH (pending only, both parties).
// Never mixes `status` into the body — that combination is a 400.
export function useEditTaskSuggestion() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: TaskSuggestionPayloadEditInput) =>
      updateTaskSuggestion(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-suggestions"] });
    },
  });

  return {
    editTaskSuggestion: mutation.mutate,
    isEditing: mutation.isPending,
  };
}
