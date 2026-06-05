import { fetchTimerSuggestion } from "@/timer/apis/fetchTimerSuggestion";
import { useQuery } from "@tanstack/react-query";
import { useTimerSuggestionQueryData } from "./useTimerSuggestionQueryData";

export function useTimerSuggestion(options?: { enabled?: boolean }) {
  const { queryKey } = useTimerSuggestionQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchTimerSuggestion,
    enabled: options?.enabled ?? true,
  });
}
