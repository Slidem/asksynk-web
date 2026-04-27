export function networkConnectionsQueryKey() {
  return ["network", "connections"] as const;
}

export const useNetworkConnectionsQueryData = () => {
  return { queryKey: networkConnectionsQueryKey() };
};
