import { createTaskSuggestion } from "@/tasks/apis/createTaskSuggestion";
import { getTaskSuggestionsQueryKey } from "@/tasks/hooks/queries/useTaskSuggestionsQueryData";
import type { TaskSuggestionCreateInput } from "@/tasks/models/taskSuggestion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTaskSuggestion() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: TaskSuggestionCreateInput) =>
      createTaskSuggestion(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTaskSuggestionsQueryKey({ role: "sent" }),
      });
    },
  });

  return {
    createTaskSuggestion: mutation.mutate,
    isCreating: mutation.isPending,
  };
}
