import { fetchTimerTransitions } from "@/timer/apis/fetchTimerTransitions";
import { useQuery } from "@tanstack/react-query";
import { useTimerTransitionsQueryData } from "./useTimerTransitionsQueryData";

/** Static state machine table — fetched once, used for optimistic updates. */
export function useTimerTransitions() {
  const { queryKey } = useTimerTransitionsQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchTimerTransitions,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
