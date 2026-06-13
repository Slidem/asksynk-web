import type { TaskSuggestionsFilters } from "@/tasks/apis/fetchTaskSuggestions";

export function getTaskSuggestionsQueryKey(filters: TaskSuggestionsFilters) {
  return ["task-suggestions", filters] as const;
}

export function getTaskSuggestionDetailQueryKey(id: string) {
  return ["task-suggestions", "detail", id] as const;
}
