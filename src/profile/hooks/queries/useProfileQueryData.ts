export function getProfileQueryKey() {
  return ["profile"] as const;
}

export function useProfileQueryData() {
  return { queryKey: getProfileQueryKey() };
}
