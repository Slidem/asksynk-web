import { useQuery } from "@tanstack/react-query";

import { fetchPublicTaggedMessages } from "@/public-schedule/apis/fetchPublicTaggedMessages";

export function publicTaggedMessagesQueryKey(slug: string) {
  return ["public-tagged-messages", slug] as const;
}

export function usePublicTaggedMessagesQuery(slug: string) {
  return useQuery({
    queryKey: publicTaggedMessagesQueryKey(slug),
    queryFn: fetchPublicTaggedMessages,
    retry: false,
  });
}
