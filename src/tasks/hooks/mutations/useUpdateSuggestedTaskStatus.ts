import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { updateTask } from "@/tasks/apis/updateTask";
import { getTaskSuggestionDetailQueryKey } from "@/tasks/hooks/queries/useTaskSuggestionsQueryData";
import type { TaskStatus } from "@/tasks/models/task";
import type { TaskSuggestion } from "@/tasks/models/taskSuggestion";
import { useQueryClient } from "@tanstack/react-query";

interface Input {
  taskId: string;
  status: TaskStatus;
}

// Suggestee checks off a materialized task from the inline message card. Reuses
// PATCH /tasks and optimistically patches the suggestion-detail cache (the card's
// source of truth). The `suggestion.updated` socket echo reconciles both sides.
export function useUpdateSuggestedTaskStatus(suggestionId: string) {
  const queryClient = useQueryClient();
  const queryKey = getTaskSuggestionDetailQueryKey(suggestionId);

  const mutation = useOptimisticMutation<TaskSuggestion | undefined, Input>({
    queryKey,
    mutationFn: ({ taskId, status }) => updateTask({ id: taskId, status }),
    updater: (prev, { taskId, status }) =>
      prev
        ? {
            ...prev,
            materializedTasks: prev.materializedTasks?.map((t) =>
              t.id === taskId ? { ...t, status } : t,
            ),
          }
        : prev,
    skipInvalidateOnSuccess: true,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-batches"] });
    },
  });

  return { updateTaskStatus: mutation.mutate, isUpdating: mutation.isPending };
}
