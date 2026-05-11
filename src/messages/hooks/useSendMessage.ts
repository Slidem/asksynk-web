import { useSession } from "@/auth";
import { createTempId } from "@/lib/id";
import { threadMessagesQueryKey } from "@/messages/hooks/queries/useThreadMessagesQueryData";
import type { Message } from "@/messages/models/message";
import { getMessageSocket } from "@/messages/socket/messageSocket";
import { notifications } from "@mantine/notifications";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useSendMessage(threadId: string) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    (body: string, tagIds: string[]) => {
      const hasBody = body.trim().length > 0;
      const hasTags = tagIds.length > 0;
      if (!hasBody && !hasTags) {
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
        senderKind: "user",
        senderId: userId,
        body,
        tagIds,
        createdAt: new Date().toISOString(),
      };

      const queryKey = threadMessagesQueryKey(threadId);
      addTemporaryMessageToCache();
      setIsSending(true);

      socket.emit("message.send", { threadId, body, tagIds }, (ack) => {
        setIsSending(false);
        if (ack.ok && ack.messageId) {
          replaceTempIdWithRealId(ack.messageId);
          return;
        }

        removeTemporaryMessage(tempId);
        notifications.show({
          color: "red",
          title: "Could not send",
          message: ack.error ?? "Please try again",
        });
      });

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

      function replaceTempIdWithRealId(realId: string) {
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
                      m.id === tempId ? { ...m, id: realId } : m,
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
