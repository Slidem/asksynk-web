import { getConnectionDisplayName } from "@/lib/connections";
import { useNetworkConnectionsQuery } from "./useNetworkConnectionsQuery";

export const useNetworkConnectionDisplayName = (
  connectionId: string | null,
) => {
  const { data: connection } = useNetworkConnectionsQuery((connections) =>
    connections.find((c) => c.userId === connectionId),
  );

  if (!connectionId || !connection) {
    return "User";
  }

  return getConnectionDisplayName(connection);
};
