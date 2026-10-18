import { fetchTimer } from "@/timer/apis/fetchTimer";
import { useQuery } from "@tanstack/react-query";
import { useTimerQueryData } from "./useTimerQueryData";

export function useTimer() {
  const { queryKey } = useTimerQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchTimer,
    // Kept fresh by command responses, WS events, reconnect and focus. A stale
    // default would refetch on every new observer mount and race the PATCH.
    staleTime: Infinity,
    refetchOnWindowFocus: "always",
  });
}
