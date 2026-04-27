import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { rejectInvite } from "@/network/apis/rejectInvite";
import type { InviteDto } from "@/network/models/invite";
import { useReceivedInvitesQueryData } from "@/network/hooks/queries/useReceivedInvitesQueryData";
import { notifications } from "@mantine/notifications";

export function useRejectInvite() {
  const { queryKey } = useReceivedInvitesQueryData();

  const mutation = useOptimisticMutation<InviteDto[], string>({
    queryKey,
    mutationFn: rejectInvite,
    updater: (previous, inviteId) =>
      (previous ?? []).map((inv) =>
        inv.id === inviteId ? { ...inv, status: "rejected" } : inv,
      ),
    skipInvalidateOnSuccess: true,
    onSuccess: () => {
      notifications.show({
        color: "gray",
        title: "Invite rejected",
        message: "The invite was dismissed.",
      });
    },
  });

  return { reject: mutation.mutate, isRejecting: mutation.isPending };
}
