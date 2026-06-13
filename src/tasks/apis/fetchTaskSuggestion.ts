import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TaskSuggestion } from "@/tasks/models/taskSuggestion";

export async function fetchTaskSuggestion(id: string): Promise<TaskSuggestion> {
  const response = await apiFetch(buildApiUrl(`/task-suggestions/${id}`));

  if (!response.ok) {
    throw new Error("Failed to load task suggestion");
  }

  return response.json();
}
