import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import { updateIntegration } from "@/integrations/apis/updateIntegration";
import type { UpdateIntegrationInput } from "@/integrations/models/calendarIntegration";
import { calendarIntegrationsQueryKey } from "@/integrations/hooks/queries/useCalendarIntegrationsQueryData";

export function useUpdateIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIntegrationInput }) =>
      updateIntegration(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarIntegrationsQueryKey });
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Could not save integration",
        message: error.message,
      });
    },
  });
}
