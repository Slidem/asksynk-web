import type { AttentionItemStatus } from "@/attentionItems/models/attentionItem";
import { threadMessagesQueryKey } from "@/messages/hooks/queries/useThreadMessagesQueryData";
import type { Message } from "@/messages/models/message";
import { getMessageSocket } from "@/messages/socket/messageSocket";
import { notifications } from "@mantine/notifications";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useUpdateMessageStatus(threadId: string) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = useCallback(
    (messageId: string, status: AttentionItemStatus) => {
      const socket = getMessageSocket();
      if (!socket) {
        notifications.show({
          color: "red",
          title: "Not connected",
          message: "Reconnecting…",
        });
        return;
      }

      const queryKey = threadMessagesQueryKey(threadId);
      let prevStatus: AttentionItemStatus | null = null;

      queryClient.setQueryData<InfiniteData<Message[]>>(queryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          pages: current.pages.map((page) =>
            page.map((m) => {
              if (m.id !== messageId || !m.managedStatus) return m;
              prevStatus = m.managedStatus.status;
              return { ...m, managedStatus: { ...m.managedStatus, status } };
            }),
          ),
        };
      });

      setIsUpdating(true);
      socket.emit("message.updateStatus", { messageId, status }, (ack) => {
        setIsUpdating(false);
        if (ack.ok) return;

        queryClient.setQueryData<InfiniteData<Message[]>>(
          queryKey,
          (current) => {
            if (!current || prevStatus === null) return current;
            return {
              ...current,
              pages: current.pages.map((page) =>
                page.map((m) =>
                  m.id === messageId && m.managedStatus
                    ? { ...m, managedStatus: { ...m.managedStatus, status: prevStatus! } }
                    : m,
                ),
              ),
            };
          },
        );
        notifications.show({
          color: "red",
          title: "Could not update status",
          message: ack.error ?? "Please try again",
        });
      });
    },
    [queryClient, threadId],
  );

  return { updateStatus, isUpdating };
}
