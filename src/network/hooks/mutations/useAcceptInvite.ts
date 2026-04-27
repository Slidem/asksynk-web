import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { acceptInvite } from "@/network/apis/acceptInvite";
import type { InviteDto } from "@/network/models/invite";
import { networkConnectionsQueryKey } from "@/network/hooks/queries/useNetworkConnectionsQueryData";
import { useReceivedInvitesQueryData } from "@/network/hooks/queries/useReceivedInvitesQueryData";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  const { queryKey } = useReceivedInvitesQueryData();

  const mutation = useOptimisticMutation<InviteDto[], string>({
    queryKey,
    mutationFn: acceptInvite,
    updater: (previous, inviteId) =>
      (previous ?? []).map((inv) =>
        inv.id === inviteId ? { ...inv, status: "accepted" } : inv,
      ),
    skipInvalidateOnSuccess: true,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkConnectionsQueryKey() });
      notifications.show({
        color: "green",
        title: "Invite accepted",
        message: "You're now connected.",
      });
    },
  });

  return { accept: mutation.mutate, isAccepting: mutation.isPending };
}
