import { createInvite } from "@/network/apis/createInvite";
import { sentInvitesQueryKey } from "@/network/hooks/queries/useSentInvitesQueryData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

export function useCreateInvite() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sentInvitesQueryKey() });
      notifications.show({
        color: "green",
        title: "Invite sent",
        message: "We emailed your invite.",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Could not send invite",
        message: error.message,
      });
    },
  });

  return {
    sendInvite: mutation.mutate,
    isSending: mutation.isPending,
  };
}
