import { fetchPublicView } from "@/public-schedule/apis/fetchPublicView";
import { useQuery } from "@tanstack/react-query";

export function publicViewQueryKey(slug: string) {
  return ["public-view", slug] as const;
}

export function usePublicViewQuery(slug: string) {
  return useQuery({
    queryKey: publicViewQueryKey(slug),
    queryFn: () => fetchPublicView(slug),
    retry: false,
    staleTime: 60_000,
  });
}
