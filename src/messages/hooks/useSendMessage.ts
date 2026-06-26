import { useSession } from "@/auth";
import { createTempId } from "@/lib/id";
import { messageRepliesQueryKey } from "@/messages/hooks/queries/useMessageRepliesQueryData";
import { threadMessagesQueryKey } from "@/messages/hooks/queries/useThreadMessagesQueryData";
import type { Message } from "@/messages/models/message";
import { getMessageSocket } from "@/messages/socket/messageSocket";
import { bumpReplyCount } from "@/messages/utils/bumpReplyCount";
import type { TaskSuggestionCreatePayload } from "@/tasks/models/taskSuggestion";
import { notifications } from "@mantine/notifications";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

interface SendMessageOptions {
  parentMessageId?: string;
  taskSuggestion?: TaskSuggestionCreatePayload;
}

export function useSendMessage(threadId: string) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    (body: string, tagIds: string[], options: SendMessageOptions = {}) => {
      const { parentMessageId, taskSuggestion } = options;
      const hasBody = body.trim().length > 0;
      const hasTags = tagIds.length > 0;
      if (!hasBody && !hasTags && !taskSuggestion) {
        return;
      }

      const socket = getMessageSocket();

      if (!socket) {
        notifications.show({
          color: "red",
          title: "Not connected",
          message: "Reconnecting…",
        });
        return;
      }

      const userId = session?.user?.id;
      if (!userId) {
        return;
      }

      const tempId = createTempId();
      const optimistic: Message = {
        id: tempId,
        threadId,
        parentMessageId: parentMessageId ?? null,
        senderKind: "user",
        senderId: userId,
        body,
        tagIds,
        createdAt: new Date().toISOString(),
        replyCount: 0,
        suggestionId: null,
      };

      const queryKey = parentMessageId
        ? messageRepliesQueryKey(threadId, parentMessageId)
        : threadMessagesQueryKey(threadId);

      addTemporaryMessageToCache();
      if (parentMessageId) {
        bumpReplyCount(queryClient, threadId, parentMessageId, 1);
      }
      setIsSending(true);

      socket.emit(
        "message.send",
        { threadId, body, tagIds, parentMessageId, taskSuggestion },
        (ack) => {
          setIsSending(false);
          if (ack.ok && ack.messageId) {
            replaceTempIdWithRealId(ack.messageId, ack.suggestionId);
            return;
          }

          removeTemporaryMessage(tempId);
          if (parentMessageId) {
            bumpReplyCount(queryClient, threadId, parentMessageId, -1);
          }
          notifications.show({
            color: "red",
            title: "Could not send",
            message: ack.error ?? "Please try again",
          });
        },
      );

      function addTemporaryMessageToCache() {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          queryKey,
          (current) => {
            if (!current) {
              return { pages: [[optimistic]], pageParams: [undefined] };
            }

            const firstPage = current.pages[0] ?? [];
            const updatedFirstPage = [optimistic, ...firstPage];
            const restOfPages = current.pages.slice(1);
            return {
              ...current,
              pages: [updatedFirstPage, ...restOfPages],
            };
          },
        );
      }

      function replaceTempIdWithRealId(realId: string, suggestionId?: string) {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          queryKey,
          (current) => {
            if (!current) {
              return current;
            }
            const existsReal = current.pages.some((page) =>
              page.some((m) => m.id === realId),
            );
            return {
              ...current,
              pages: current.pages.map((page) =>
                existsReal
                  ? page.filter((m) => m.id !== tempId)
                  : page.map((m) =>
                      m.id === tempId
                        ? {
                            ...m,
                            id: realId,
                            suggestionId: suggestionId ?? m.suggestionId,
                          }
                        : m,
                    ),
              ),
            };
          },
        );
      }

      function removeTemporaryMessage(tempId: string) {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          queryKey,
          (current) => {
            if (!current) {
              return current;
            }
            return {
              ...current,
              pages: current.pages.map((page) =>
                page.filter((m) => m.id !== tempId),
              ),
            };
          },
        );
      }
    },
    [queryClient, session?.user?.id, threadId],
  );

  return { sendMessage, isSending };
}
