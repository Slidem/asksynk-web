import { fetchThreads } from "@/messages/apis/fetchThreads";
import { useThreadsQueryData } from "@/messages/hooks/queries/useThreadsQueryData";
import type { ThreadListItem } from "@/messages/models/thread";
import { useQuery } from "@tanstack/react-query";

const selectUserThreads = (threads: ThreadListItem[]) =>
  threads.filter((t) => t.publicViewId === null);

export function useThreadsQuery() {
  const { queryKey } = useThreadsQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchThreads,
    select: selectUserThreads,
    placeholderData: [],
  });
}
