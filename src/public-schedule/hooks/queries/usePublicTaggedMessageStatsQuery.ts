import { useQuery } from "@tanstack/react-query";

import { fetchPublicTaggedMessageStats } from "@/public-schedule/apis/fetchPublicTaggedMessageStats";

export function publicTaggedMessageStatsQueryKey(slug: string) {
  return ["public-tagged-messages-stats", slug] as const;
}

// TODO(missingApis): ASK-12 — kept disabled until the guest tagged-message
// stats endpoint exists (see missingApis/ASK-12.md). Flip `enabled` to true
// once the backend ships it; the stats bar reads `resolved` / `pending`.
export function usePublicTaggedMessageStatsQuery(slug: string) {
  return useQuery({
    queryKey: publicTaggedMessageStatsQueryKey(slug),
    queryFn: fetchPublicTaggedMessageStats,
    enabled: false,
    retry: false,
  });
}
