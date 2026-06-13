import { fetchTaskSuggestion } from "@/tasks/apis/fetchTaskSuggestion";
import { getTaskSuggestionDetailQueryKey } from "@/tasks/hooks/queries/useTaskSuggestionsQueryData";
import { useQuery } from "@tanstack/react-query";

export function useTaskSuggestion(id: string, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: getTaskSuggestionDetailQueryKey(id),
    queryFn: () => fetchTaskSuggestion(id),
    enabled: opts?.enabled ?? true,
  });
}
