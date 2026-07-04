import { useQuery } from "@tanstack/react-query";

import { fetchPublicTaggedMessages } from "@/public-schedule/apis/fetchPublicTaggedMessages";

export function publicTaggedMessagesQueryKey(slug: string, query: string) {
  return ["public-tagged-messages", slug, query] as const;
}

// TODO(missingApis): ASK-12 — kept disabled until the guest tagged-message
// search endpoint exists (see missingApis/ASK-12.md). Flip `enabled` to
// `query.trim().length > 0` once the backend ships it.
export function usePublicTaggedMessagesQuery(slug: string, query: string) {
  return useQuery({
    queryKey: publicTaggedMessagesQueryKey(slug, query),
    queryFn: () => fetchPublicTaggedMessages(query),
    enabled: false,
    retry: false,
  });
}
