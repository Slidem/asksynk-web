import { fetchThreads } from "@/messages/apis/fetchThreads";
import { useThreadsQueryData } from "@/messages/hooks/queries/useThreadsQueryData";
import { useQuery } from "@tanstack/react-query";

// Includes guest threads (publicViewId != null) so the owner sees and can reply
// to public-view conversations inline in the Messages list.
export function useThreadsQuery() {
  const { queryKey } = useThreadsQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchThreads,
    placeholderData: [],
  });
}
