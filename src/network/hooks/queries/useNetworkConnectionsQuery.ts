import { fetchNetworkConnections } from "@/network/apis/fetchNetworkConnections";
import { useNetworkConnectionsQueryData } from "@/network/hooks/queries/useNetworkConnectionsQueryData";
import { useQuery } from "@tanstack/react-query";

export function useNetworkConnectionsQuery() {
  const { queryKey } = useNetworkConnectionsQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchNetworkConnections,
    placeholderData: [],
  });
}
