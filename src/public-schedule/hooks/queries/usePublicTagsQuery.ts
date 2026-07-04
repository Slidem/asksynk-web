import { useQuery } from "@tanstack/react-query";

import { fetchPublicTags } from "@/public-schedule/apis/fetchPublicTags";

export function publicTagsQueryKey(slug: string) {
  return ["public-tags", slug] as const;
}

// TODO(missingApis): ASK-12 — kept disabled until the guest-scoped owner-tags
// endpoint exists (see missingApis/ASK-12.md). Flip `enabled` to true once the
// backend ships it; the composer tag picker + message chips populate from it.
export function usePublicTagsQuery(slug: string) {
  return useQuery({
    queryKey: publicTagsQueryKey(slug),
    queryFn: fetchPublicTags,
    enabled: false,
    retry: false,
    staleTime: 60_000,
  });
}
