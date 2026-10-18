export function timerQueryKey() {
  return ["timer", "current"] as const;
}

export function useTimerQueryData() {
  return { queryKey: timerQueryKey() };
}
