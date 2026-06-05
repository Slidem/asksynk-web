import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { updateTimerSettings } from "@/timer/apis/updateTimerSettings";
import type { TimerSettings } from "@/timer/models/timer";
import { useQueryClient } from "@tanstack/react-query";
import { timerSettingsQueryKey } from "../queries/useTimerSettingsQueryData";

export function useUpdateTimerSettings() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<TimerSettings, TimerSettings>({
    queryKey: timerSettingsQueryKey(),
    mutationFn: (input) => updateTimerSettings(input),
    updater: (_previous, input) => input,
    skipInvalidateOnSuccess: true,
    onSuccess: (data) => {
      queryClient.setQueryData(timerSettingsQueryKey(), data as TimerSettings);
    },
  });
}
