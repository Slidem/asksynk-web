export function timerQueryKey() {
  return ["timer"] as const;
}

export function useTimerQueryData() {
  return { queryKey: timerQueryKey() };
}
