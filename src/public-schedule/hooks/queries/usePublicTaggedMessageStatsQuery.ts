import { useQuery } from "@tanstack/react-query";

import { fetchPublicTaggedMessageStats } from "@/public-schedule/apis/fetchPublicTaggedMessageStats";

export function publicTaggedMessageStatsQueryKey(slug: string) {
  return ["public-tagged-messages-stats", slug] as const;
}

export function usePublicTaggedMessageStatsQuery(slug: string) {
  return useQuery({
    queryKey: publicTaggedMessageStatsQueryKey(slug),
    queryFn: fetchPublicTaggedMessageStats,
    retry: false,
  });
}
