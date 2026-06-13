import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  TaskSuggestion,
  TaskSuggestionCreateInput,
} from "@/tasks/models/taskSuggestion";

export async function createTaskSuggestion(
  input: TaskSuggestionCreateInput,
): Promise<TaskSuggestion> {
  const response = await apiFetch(buildApiUrl("/task-suggestions"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create task suggestion");
  }

  return response.json();
}
