import { createTempId } from "@/lib/id";
import type { Message } from "@/messages/models/message";
import { publicThreadMessagesQueryKey } from "@/public-schedule/hooks/queries/usePublicThreadMessagesQueryData";
import { useGuestSession } from "@/public-schedule/hooks/useGuestSession";
import { getGuestMessageSocket } from "@/public-schedule/socket/guestMessageSocket";
import { notifications } from "@mantine/notifications";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useSendGuestMessage(slug: string) {
  const queryClient = useQueryClient();
  const session = useGuestSession();
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    (body: string, tagIds: string[] = []) => {
      if (body.trim().length === 0) return;

      const socket = getGuestMessageSocket();
      if (!socket) {
        notifications.show({
          color: "red",
          title: "Not connected",
          message: "Reconnecting…",
        });
        return;
      }

      const guestId = session?.guestId;
      if (!guestId) return;

      const queryKey = publicThreadMessagesQueryKey(slug);
      const tempId = createTempId();
      const optimistic: Message = {
        id: tempId,
        threadId: "",
        parentMessageId: null,
        senderKind: "guest",
        senderId: guestId,
        body,
        tagIds,
        createdAt: new Date().toISOString(),
        replyCount: 0,
        suggestionId: null,
      };

      addToCache(optimistic);
      setIsSending(true);

      socket.emit("message.send", { body, tagIds }, (ack) => {
        setIsSending(false);
        if (ack.ok && ack.messageId) {
          replaceTempId(ack.messageId);
          return;
        }
        removeTemp();
        notifications.show({
          color: "red",
          title: "Could not send",
          message: ack.error ?? "Please try again",
        });
      });

      function addToCache(message: Message) {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          queryKey,
          (current) => {
            if (!current) {
              return { pages: [[message]], pageParams: [undefined] };
            }
            const firstPage = current.pages[0] ?? [];
            return {
              ...current,
              pages: [[message, ...firstPage], ...current.pages.slice(1)],
            };
          },
        );
      }

      function replaceTempId(realId: string) {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          queryKey,
          (current) => {
            if (!current) return current;
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

      function removeTemp() {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          queryKey,
          (current) => {
            if (!current) return current;
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
    [queryClient, session?.guestId, slug],
  );

  return { sendMessage, isSending };
}
