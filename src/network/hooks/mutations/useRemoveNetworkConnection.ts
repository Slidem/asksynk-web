import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { removeNetworkConnection } from "@/network/apis/removeNetworkConnection";
import type { NetworkConnectionDto } from "@/network/models/networkConnection";
import { useNetworkConnectionsQueryData } from "@/network/hooks/queries/useNetworkConnectionsQueryData";
import { notifications } from "@mantine/notifications";

export function useRemoveNetworkConnection() {
  const { queryKey } = useNetworkConnectionsQueryData();

  const mutation = useOptimisticMutation<NetworkConnectionDto[], string>({
    queryKey,
    mutationFn: removeNetworkConnection,
    updater: (previous, userId) =>
      (previous ?? []).filter((c) => c.userId !== userId),
    skipInvalidateOnSuccess: true,
    onSuccess: () => {
      notifications.show({
        color: "gray",
        title: "Connection removed",
        message: "You're no longer connected.",
      });
    },
  });

  return { remove: mutation.mutate, isRemoving: mutation.isPending };
}
