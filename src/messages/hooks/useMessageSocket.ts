import { connectMessageSocket } from "@/messages/socket/messageSocket";
import { messageRepliesQueryKey } from "@/messages/hooks/queries/useMessageRepliesQueryData";
import { threadMessagesQueryKey } from "@/messages/hooks/queries/useThreadMessagesQueryData";
import { threadsQueryKey } from "@/messages/hooks/queries/useThreadsQueryData";
import type { Message } from "@/messages/models/message";
import type { ThreadListItem } from "@/messages/models/thread";
import { bumpReplyCount } from "@/messages/utils/bumpReplyCount";
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

      if (message.parentMessageId) {
        appendReply(threadId, message);
        return;
      }

      appendTopLevel(threadId, message);
      bumpThreadInList(threadId, message);
    };

    function appendTopLevel(threadId: string, message: Message) {
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
    }

    function appendReply(threadId: string, message: Message) {
      const parentId = message.parentMessageId!;
      let shouldBump = false;
      queryClient.setQueryData<InfiniteData<Message[]>>(
        messageRepliesQueryKey(threadId, parentId),
        (current) => {
          if (!current) {
            shouldBump = true;
            return current;
          }
          const firstPage = current.pages[0] ?? [];

          if (firstPage.some((m) => m.id === message.id)) {
            return current;
          }

          shouldBump = true;
          const nextFirst = [message, ...firstPage];
          return {
            ...current,
            pages: [nextFirst, ...current.pages.slice(1)],
          };
        },
      );
      if (shouldBump) {
        bumpReplyCount(queryClient, threadId, parentId, 1);
      }
    }

    function bumpThreadInList(threadId: string, message: Message) {
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
    }

    const handleMessageUpdated = (payload: {
      threadId: string;
      message: Message;
    }) => {
      const { threadId, message } = payload;

      queryClient.setQueryData<InfiniteData<Message[]>>(
        threadMessagesQueryKey(threadId),
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) =>
              page.map((m) => (m.id === message.id ? message : m)),
            ),
          };
        },
      );
    };

    socket.on("message.created", handleMessageCreated);
    socket.on("message.updated", handleMessageUpdated);

    return () => {
      socket.off("message.created", handleMessageCreated);
      socket.off("message.updated", handleMessageUpdated);
    };
  }, [queryClient]);
}
