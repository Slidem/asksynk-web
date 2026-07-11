import type { ManagedStatus, Message } from "@/messages/models/message";
import { publicThreadMessagesQueryKey } from "@/public-schedule/hooks/queries/usePublicThreadMessagesQueryData";
import {
  connectGuestMessageSocket,
  disconnectGuestMessageSocket,
} from "@/public-schedule/socket/guestMessageSocket";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Connects the guest socket for the lifetime of the messages panel and folds
// incoming messages into the thread cache.
export function useGuestMessageSocket(slug: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectGuestMessageSocket();

    const handleMessageCreated = (payload: { message: Message }) => {
      const { message } = payload;
      queryClient.setQueryData<InfiniteData<Message[]>>(
        publicThreadMessagesQueryKey(slug),
        (current) => {
          if (!current) return current;
          const firstPage = current.pages[0] ?? [];
          if (firstPage.some((m) => m.id === message.id)) {
            return current;
          }
          return {
            ...current,
            pages: [[message, ...firstPage], ...current.pages.slice(1)],
          };
        },
      );
    };

    const handleStatusUpdated = (payload: {
      messageId: string;
      managedStatus: ManagedStatus;
    }) => {
      const { messageId, managedStatus } = payload;
      queryClient.setQueryData<InfiniteData<Message[]>>(
        publicThreadMessagesQueryKey(slug),
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) =>
              page.map((m) =>
                m.id === messageId ? { ...m, managedStatus } : m,
              ),
            ),
          };
        },
      );
    };

    socket.on("message.created", handleMessageCreated);
    socket.on("message.status.updated", handleStatusUpdated);

    return () => {
      socket.off("message.created", handleMessageCreated);
      socket.off("message.status.updated", handleStatusUpdated);
      disconnectGuestMessageSocket();
    };
  }, [queryClient, slug]);
}
