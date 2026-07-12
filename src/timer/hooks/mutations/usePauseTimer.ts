import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { patchTimer } from "@/timer/apis/patchTimer";
import type { Timer } from "@/timer/models/timer";
import { playTimerSound } from "@/timer/sounds/timerSoundPlayer";
import { useQueryClient } from "@tanstack/react-query";
import { timerQueryKey } from "../queries/useTimerQueryData";

export function usePauseTimer() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<Timer, void>({
    queryKey: timerQueryKey(),
    mutationFn: () => patchTimer({ status: "paused" }),
    updater: (previous) => {
      if (!previous) return previous;
      const now = Date.now();
      const remaining = previous.completesAt
        ? Math.max(0, (new Date(previous.completesAt).getTime() - now) / 1000)
        : previous.remainingSeconds;
      return {
        ...previous,
        status: "paused",
        remainingSeconds: Math.round(remaining),
        completesAt: null,
        transitionedAt: new Date(now).toISOString(),
      };
    },
    skipInvalidateOnSuccess: true,
    onSuccess: (data) => {
      queryClient.setQueryData(timerQueryKey(), data as Timer);
      playTimerSound("pause");
    },
  });
}
