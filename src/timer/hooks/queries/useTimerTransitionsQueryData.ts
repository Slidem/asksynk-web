export function timerTransitionsQueryKey() {
  return ["timer", "transitions"] as const;
}

export function useTimerTransitionsQueryData() {
  return { queryKey: timerTransitionsQueryKey() };
}
