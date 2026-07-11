import type { Message } from "@/messages/models/message";
import { publicThreadMessagesQueryKey } from "@/public-schedule/hooks/queries/usePublicThreadMessagesQueryData";
import { getGuestMessageSocket } from "@/public-schedule/socket/guestMessageSocket";
import { notifications } from "@mantine/notifications";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useTagGuestMessage(slug: string) {
  const queryClient = useQueryClient();
  const [isTagging, setIsTagging] = useState(false);

  const tagMessage = useCallback(
    (messageId: string, tagIds: string[]) => {
      const socket = getGuestMessageSocket();
      if (!socket) {
        notifications.show({
          color: "red",
          title: "Not connected",
          message: "Reconnecting…",
        });
        return;
      }

      const queryKey = publicThreadMessagesQueryKey(slug);
      let prevTagIds: string[] | null = null;

      queryClient.setQueryData<InfiniteData<Message[]>>(queryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          pages: current.pages.map((page) =>
            page.map((m) => {
              if (m.id !== messageId) return m;
              prevTagIds = m.tagIds;
              return { ...m, tagIds };
            }),
          ),
        };
      });

      setIsTagging(true);
      socket.emit("message.tag", { messageId, tagIds }, (ack) => {
        setIsTagging(false);
        if (ack.ok) return;

        queryClient.setQueryData<InfiniteData<Message[]>>(
          queryKey,
          (current) => {
            if (!current) return current;
            return {
              ...current,
              pages: current.pages.map((page) =>
                page.map((m) =>
                  m.id === messageId ? { ...m, tagIds: prevTagIds ?? [] } : m,
                ),
              ),
            };
          },
        );
        notifications.show({
          color: "red",
          title: "Could not tag message",
          message: ack.error ?? "Please try again",
        });
      });
    },
    [queryClient, slug],
  );

  return { tagMessage, isTagging };
}
