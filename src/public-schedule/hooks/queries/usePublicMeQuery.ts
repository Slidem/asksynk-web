import { fetchPublicMe } from "@/public-schedule/apis/fetchPublicMe";
import { useGuestSession } from "@/public-schedule/hooks/useGuestSession";
import { useQuery } from "@tanstack/react-query";

export function publicMeQueryKey(token: string) {
  return ["public-me", token] as const;
}

export function usePublicMeQuery() {
  const session = useGuestSession();
  return useQuery({
    queryKey: publicMeQueryKey(session?.token ?? "none"),
    queryFn: fetchPublicMe,
    enabled: !!session,
    retry: false,
  });
}
