export function timerSuggestionQueryKey() {
  return ["timer", "suggestion"] as const;
}

export function useTimerSuggestionQueryData() {
  return { queryKey: timerSuggestionQueryKey() };
}
