import { useQuery } from "@tanstack/react-query";

import { ensureCalendar } from "@/schedule/apis/ensureCalendar";

export function useEnsureCalendar() {
  return useQuery({
    queryKey: ["calendar"],
    queryFn: ensureCalendar,
    staleTime: Infinity,
  });
}
