import { updateTaskSuggestion } from "@/tasks/apis/updateTaskSuggestion";
import type { TaskSuggestionRespondInput } from "@/tasks/models/taskSuggestion";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Accept/reject a received suggestion. Accept materializes real tasks assigned
// to the recipient and resolves the suggestion's inbox item server-side; both
// land via `attention.upserted` (eventually consistent — shortly after this
// REST call returns), so the attention invalidate is a belt-and-suspenders
// fallback.
export function useRespondToTaskSuggestion() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: TaskSuggestionRespondInput) =>
      updateTaskSuggestion(input),
    onSuccess: (suggestion, input) => {
      queryClient.invalidateQueries({ queryKey: ["task-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["attention-items"] });
      if (input.status === "accepted") {
        notifications.show({
          title: "Suggestion accepted",
          message:
            suggestion.payload.tagIds.length > 0
              ? "Added to My Tasks"
              : "Added to My Tasks — tag it to surface on your dashboard",
        });
      }
    },
  });

  return { respond: mutation.mutate, isResponding: mutation.isPending };
}
