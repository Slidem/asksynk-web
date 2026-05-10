import { fetchThreadMessages } from "@/messages/apis/fetchThreadMessages";
import { useThreadMessagesQueryData } from "@/messages/hooks/queries/useThreadMessagesQueryData";
import type { Message } from "@/messages/models/message";
import { useInfiniteQuery } from "@tanstack/react-query";

export const THREAD_MESSAGES_PAGE_SIZE = 50;

export function useThreadMessagesQuery(threadId: string) {
  const { queryKey } = useThreadMessagesQueryData(threadId);
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchThreadMessages({
        threadId,
        before: pageParam,
        limit: THREAD_MESSAGES_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: Message[]) => {
      if (lastPage.length < THREAD_MESSAGES_PAGE_SIZE) {
        return undefined;
      }
      return lastPage[lastPage.length - 1]?.createdAt;
    },
  });
}
