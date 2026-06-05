import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { patchTimer } from "@/timer/apis/patchTimer";
import type { Timer } from "@/timer/models/timer";
import { playTimerSound } from "@/timer/sounds/timerSoundPlayer";
import { useQueryClient } from "@tanstack/react-query";
import { timerQueryKey } from "../queries/useTimerQueryData";
import { timerSuggestionQueryKey } from "../queries/useTimerSuggestionQueryData";

export function useStopTimer() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<Timer, void>({
    queryKey: timerQueryKey(),
    mutationFn: () => patchTimer({ status: "stopped" }),
    updater: (previous) => {
      if (!previous) return previous as Timer;
      const now = Date.now();
      return {
        ...previous,
        status: "stopped",
        remainingSeconds: 0,
        completesAt: null,
        transitionedAt: new Date(now).toISOString(),
      };
    },
    skipInvalidateOnSuccess: true,
    onSuccess: (data) => {
      queryClient.setQueryData(timerQueryKey(), data as Timer);
      queryClient.invalidateQueries({ queryKey: timerSuggestionQueryKey() });
      playTimerSound("stop");
    },
  });
}
