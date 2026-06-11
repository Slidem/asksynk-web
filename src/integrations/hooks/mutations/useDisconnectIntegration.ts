import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import { disconnectIntegration } from "@/integrations/apis/disconnectIntegration";
import { calendarIntegrationsQueryKey } from "@/integrations/hooks/queries/useCalendarIntegrationsQueryData";

export function useDisconnectIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarIntegrationsQueryKey });
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      notifications.show({
        color: "green",
        title: "Integration disconnected",
        message: "Imported calendars and events were removed.",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Could not disconnect",
        message: error.message,
      });
    },
  });
}
