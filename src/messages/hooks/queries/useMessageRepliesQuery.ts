import { fetchMessageReplies } from "@/messages/apis/fetchMessageReplies";
import { useMessageRepliesQueryData } from "@/messages/hooks/queries/useMessageRepliesQueryData";
import type { Message } from "@/messages/models/message";
import { useInfiniteQuery } from "@tanstack/react-query";

export const MESSAGE_REPLIES_PAGE_SIZE = 50;

export function useMessageRepliesQuery(
  threadId: string,
  messageId: string | null,
) {
  const { queryKey } = useMessageRepliesQueryData(threadId, messageId ?? "");
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchMessageReplies({
        threadId,
        messageId: messageId!,
        before: pageParam,
        limit: MESSAGE_REPLIES_PAGE_SIZE,
      }),
    enabled: !!messageId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: Message[]) => {
      if (lastPage.length < MESSAGE_REPLIES_PAGE_SIZE) {
        return undefined;
      }
      return lastPage[lastPage.length - 1]?.createdAt;
    },
  });
}
