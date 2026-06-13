import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  SuggestionRole,
  SuggestionStatus,
  TaskSuggestion,
} from "@/tasks/models/taskSuggestion";

export interface TaskSuggestionsFilters {
  role: SuggestionRole;
  status?: SuggestionStatus;
}

export async function fetchTaskSuggestions(
  filters: TaskSuggestionsFilters,
): Promise<TaskSuggestion[]> {
  const params = new URLSearchParams();
  params.set("role", filters.role);
  if (filters.status) {
    params.set("status", filters.status);
  }

  const response = await apiFetch(
    buildApiUrl(`/task-suggestions?${params.toString()}`),
  );

  if (!response.ok) {
    throw new Error("Failed to load task suggestions");
  }

  return response.json();
}
