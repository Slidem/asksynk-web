import { useQuery } from "@tanstack/react-query";

import { fetchPublicPendingActionsCount } from "@/public-schedule/apis/fetchPublicPendingActionsCount";

export function publicPendingActionsCountQueryKey(slug: string) {
  return ["public-pending-actions-count", slug] as const;
}

// TODO(missingApis): ASK-11 — kept disabled until the guest pending-actions
// count endpoint exists (see missingApis/ASK-11.md). Flip `enabled` to true
// once the backend ships it; the bell auto-appears when count > 0.
export function usePublicPendingActionsCountQuery(slug: string) {
  return useQuery({
    queryKey: publicPendingActionsCountQueryKey(slug),
    queryFn: fetchPublicPendingActionsCount,
    enabled: false,
    retry: false,
  });
}
