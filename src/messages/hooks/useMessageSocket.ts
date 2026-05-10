import {
  connectMessageSocket,
  disconnectMessageSocket,
} from "@/messages/socket/messageSocket";
import { threadMessagesQueryKey } from "@/messages/hooks/queries/useThreadMessagesQueryData";
import { threadsQueryKey } from "@/messages/hooks/queries/useThreadsQueryData";
import type { Message } from "@/messages/models/message";
import type { ThreadListItem } from "@/messages/models/thread";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useMessageSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectMessageSocket();

    const handleMessageCreated = (payload: {
      threadId: string;
      message: Message;
    }) => {
      const { threadId, message } = payload;

      queryClient.setQueryData<InfiniteData<Message[]>>(
        threadMessagesQueryKey(threadId),
        (current) => {
          if (!current) {
            return current;
          }
          const firstPage = current.pages[0] ?? [];

          if (firstPage.some((m) => m.id === message.id)) {
            return current;
          }

          const nextFirst = [message, ...firstPage];
          return {
            ...current,
            pages: [nextFirst, ...current.pages.slice(1)],
          };
        },
      );

      queryClient.setQueryData<ThreadListItem[]>(
        threadsQueryKey(),
        (current) => {
          if (!current) {
            return current;
          }

          const idx = current.findIndex((t) => t.threadId === threadId);
          if (idx === -1) {
            queryClient.invalidateQueries({ queryKey: threadsQueryKey() });
            return current;
          }

          const updated: ThreadListItem = {
            ...current[idx],
            lastMessage: {
              body: message.body,
              createdAt: message.createdAt,
              senderKind: message.senderKind,
            },
          };

          return [updated, ...current.filter((_, i) => i !== idx)];
        },
      );
    };

    socket.on("message.created", handleMessageCreated);

    return () => {
      socket.off("message.created", handleMessageCreated);
      disconnectMessageSocket();
    };
  }, [queryClient]);
}
