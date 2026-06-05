export function timerSettingsQueryKey() {
  return ["timer", "settings"] as const;
}

export function useTimerSettingsQueryData() {
  return { queryKey: timerSettingsQueryKey() };
}
