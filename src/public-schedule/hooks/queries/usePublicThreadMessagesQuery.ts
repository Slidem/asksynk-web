import { fetchPublicThreadMessages } from "@/public-schedule/apis/fetchPublicThreadMessages";
import { usePublicThreadMessagesQueryData } from "@/public-schedule/hooks/queries/usePublicThreadMessagesQueryData";
import type { Message } from "@/messages/models/message";
import { useInfiniteQuery } from "@tanstack/react-query";

export const PUBLIC_THREAD_MESSAGES_PAGE_SIZE = 50;

export function usePublicThreadMessagesQuery(slug: string) {
  const { queryKey } = usePublicThreadMessagesQueryData(slug);
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchPublicThreadMessages({
        before: pageParam,
        limit: PUBLIC_THREAD_MESSAGES_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: Message[]) => {
      if (lastPage.length < PUBLIC_THREAD_MESSAGES_PAGE_SIZE) {
        return undefined;
      }
      return lastPage[lastPage.length - 1]?.createdAt;
    },
  });
}
