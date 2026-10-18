import { requestNotificationPermission } from "@/lib/browserNotification";
import { ApiError } from "@/lib/apiError";
import { sendTimerCommand } from "@/timer/apis/sendTimerCommand";
import type {
  Timer,
  TimerCommandRequest,
  TimerSettings,
  TimerTransitions,
} from "@/timer/models/timer";
import type { TimerSoundType } from "@/timer/sounds/soundTypes";
import { playTimerSound } from "@/timer/sounds/timerSoundPlayer";
import { useTimerRuntimeStore } from "@/timer/store/timerRuntimeStore";
import { applyCommand } from "@/timer/utils/timerMachine";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timerQueryKey } from "@/timer/hooks/queries/useTimerQueryData";
import { timerSettingsQueryKey } from "@/timer/hooks/queries/useTimerSettingsQueryData";
import { timerTransitionsQueryKey } from "@/timer/hooks/queries/useTimerTransitionsQueryData";

export const timerCommandMutationKey = ["timer", "command"] as const;

const SOUNDS: Record<TimerCommandRequest["command"], TimerSoundType> = {
  start: "start",
  pause: "pause",
  resume: "resume",
  stop: "stop",
  reset: "stop",
};

export function useTimerCommand() {
  const queryClient = useQueryClient();
  // The settling mutation still counts as pending inside its callbacks.
  const isLastPending = () =>
    queryClient.isMutating({ mutationKey: timerCommandMutationKey }) === 1;

  return useMutation({
    mutationKey: timerCommandMutationKey,
    // Serialize PATCHes so rapid clicks reach the server in order.
    scope: { id: "timer" },
    mutationFn: sendTimerCommand,
    onMutate: async (input: TimerCommandRequest) => {
      // First start is a user gesture — good moment to ask for desktop alerts.
      if (input.command === "start") void requestNotificationPermission();
      playTimerSound(SOUNDS[input.command]);

      await queryClient.cancelQueries({ queryKey: timerQueryKey() });

      const timer = queryClient.getQueryData<Timer>(timerQueryKey());
      const table = queryClient.getQueryData<TimerTransitions>(
        timerTransitionsQueryKey(),
      );
      const settings = queryClient.getQueryData<TimerSettings>(
        timerSettingsQueryKey(),
      );
      if (!timer || !table) return;

      const now = Date.now();
      const next = applyCommand(timer, table, settings, input, now);
      if (!next) return;

      // Same clock as the optimistic state, so the first frame isn't stale.
      useTimerRuntimeStore.getState().setNowMs(now);
      queryClient.setQueryData(timerQueryKey(), next);
    },
    onSuccess: (data) => {
      // A newer command's optimistic state must not be clobbered by this response.
      if (isLastPending()) queryClient.setQueryData(timerQueryKey(), data);
    },
    onError: (error) => {
      // 409 = expected race (another device, completion job) — just resync.
      if (!(error instanceof ApiError && error.status === 409)) {
        notifications.show({
          color: "red",
          title: "Timer not updated",
          message: "Something went wrong. Synced to the latest state.",
        });
      }
      if (isLastPending()) {
        queryClient.invalidateQueries({ queryKey: timerQueryKey() });
      }
    },
  });
}
