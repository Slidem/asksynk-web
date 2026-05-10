import {
  createOrGetThread,
  type CreateOrGetThreadResponse,
} from "@/messages/apis/createOrGetThread";
import { threadsQueryKey } from "@/messages/hooks/queries/useThreadsQueryData";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateOrGetThread() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createOrGetThread,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: threadsQueryKey() });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Could not start conversation",
        message: error.message,
      });
    },
  });

  return {
    startThread: (
      recipientUserId: string,
      onDone?: (data: CreateOrGetThreadResponse) => void,
    ) => mutation.mutate({ recipientUserId }, { onSuccess: onDone }),
    isStarting: mutation.isPending,
  };
}
