import type { Message } from "@/messages/models/message";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { threadMessagesQueryKey } from "@/messages/hooks/queries/useThreadMessagesQueryData";

export function bumpReplyCount(
  queryClient: QueryClient,
  threadId: string,
  parentMessageId: string,
  delta: number,
) {
  queryClient.setQueryData<InfiniteData<Message[]>>(
    threadMessagesQueryKey(threadId),
    (current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        pages: current.pages.map((page) =>
          page.map((m) =>
            m.id === parentMessageId
              ? { ...m, replyCount: Math.max(0, m.replyCount + delta) }
              : m,
          ),
        ),
      };
    },
  );
}
