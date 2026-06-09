export function getUserSettingsQueryKey() {
  return ["user-settings"] as const;
}

export function useUserSettingsQueryData() {
  return { queryKey: getUserSettingsQueryKey() };
}
