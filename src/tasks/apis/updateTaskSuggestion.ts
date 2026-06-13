import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  TaskSuggestion,
  TaskSuggestionPayloadEditInput,
  TaskSuggestionRespondInput,
} from "@/tasks/models/taskSuggestion";

export async function updateTaskSuggestion(
  input: TaskSuggestionRespondInput | TaskSuggestionPayloadEditInput,
): Promise<TaskSuggestion> {
  const { id, ...body } = input;
  const response = await apiFetch(buildApiUrl(`/task-suggestions/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to update task suggestion");
  }

  return response.json();
}
