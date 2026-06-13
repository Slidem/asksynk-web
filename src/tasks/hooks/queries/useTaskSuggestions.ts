import { fetchTaskSuggestions } from "@/tasks/apis/fetchTaskSuggestions";
import { getTaskSuggestionsQueryKey } from "@/tasks/hooks/queries/useTaskSuggestionsQueryData";
import type {
  SuggestionRole,
  SuggestionStatus,
  TaskSuggestion,
} from "@/tasks/models/taskSuggestion";
import { useQuery } from "@tanstack/react-query";

export function useTaskSuggestions<T = TaskSuggestion[]>(
  role: SuggestionRole,
  status?: SuggestionStatus,
  selectFn?: (data: TaskSuggestion[]) => T,
) {
  const filters = { role, status };
  return useQuery({
    queryKey: getTaskSuggestionsQueryKey(filters),
    queryFn: () => fetchTaskSuggestions(filters),
    placeholderData: [],
    select: selectFn,
  });
}
