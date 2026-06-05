import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { patchTimer } from "@/timer/apis/patchTimer";
import type { SessionType, Timer } from "@/timer/models/timer";
import { playTimerSound } from "@/timer/sounds/timerSoundPlayer";
import { requestNotificationPermission } from "@/timer/utils/browserNotification";
import { useQueryClient } from "@tanstack/react-query";
import { timerQueryKey } from "../queries/useTimerQueryData";
import { timerSuggestionQueryKey } from "../queries/useTimerSuggestionQueryData";

interface StartTimerInput {
  sessionType: SessionType;
  durationSeconds: number;
}

export function useStartTimer() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<Timer, StartTimerInput>({
    queryKey: timerQueryKey(),
    mutationFn: ({ sessionType, durationSeconds }) =>
      patchTimer({ status: "running", sessionType, durationSeconds }),
    updater: (previous, input) => {
      if (!previous) return previous as Timer;
      const now = Date.now();
      return {
        ...previous,
        status: "running",
        sessionType: input.sessionType,
        sessionDurationSeconds: input.durationSeconds,
        remainingSeconds: input.durationSeconds,
        completesAt: new Date(now + input.durationSeconds * 1000).toISOString(),
        transitionedAt: new Date(now).toISOString(),
      };
    },
    skipInvalidateOnSuccess: true,
    onSuccess: (data) => {
      queryClient.setQueryData(timerQueryKey(), data as Timer);
      queryClient.invalidateQueries({ queryKey: timerSuggestionQueryKey() });
      playTimerSound("start");
      // First start is a user gesture — good moment to ask for desktop alerts.
      void requestNotificationPermission();
    },
  });
}
