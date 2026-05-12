import { fetchNetworkConnections } from "@/network/apis/fetchNetworkConnections";
import { useNetworkConnectionsQueryData } from "@/network/hooks/queries/useNetworkConnectionsQueryData";
import { useQuery } from "@tanstack/react-query";

type NetworkConnectionsData = Awaited<
  ReturnType<typeof fetchNetworkConnections>
>;

export function useNetworkConnectionsQuery<T = NetworkConnectionsData>(
  selectFn?: (data: NetworkConnectionsData) => T,
) {
  const { queryKey } = useNetworkConnectionsQueryData();
  return useQuery({
    select: selectFn,
    queryKey,
    queryFn: fetchNetworkConnections,
    placeholderData: [],
  });
}
