import type { QueryClient } from "@tanstack/react-query";
import { timerCommandMutationKey } from "@/timer/hooks/mutations/useTimerCommand";
import { timerQueryKey } from "@/timer/hooks/queries/useTimerQueryData";

/**
 * Refetch the timer unless a command is in flight — its response already
 * carries the server state, and a parallel GET could land stale data.
 */
export function refreshTimer(queryClient: QueryClient) {
  if (queryClient.isMutating({ mutationKey: timerCommandMutationKey }) > 0) {
    return;
  }
  void queryClient.invalidateQueries({ queryKey: timerQueryKey() });
}
