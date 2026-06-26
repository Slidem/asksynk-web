import type { CalendarIntegrationDto } from "@/integrations/models/calendarIntegration";
import { isCalendarProvider } from "@/integrations/models/provider";
import { useCalendarIntegrations } from "./useCalendarIntegrations";

// Module-scoped so react-query memoizes the select result by data identity.
function selectErroredCalendars(
  integrations: CalendarIntegrationDto[],
): CalendarIntegrationDto[] {
  return integrations.filter(
    (integration) =>
      isCalendarProvider(integration.provider) &&
      integration.status === "error",
  );
}

/** Calendar-kind integrations currently in an error state. */
export function useErroredCalendarIntegrations() {
  return useCalendarIntegrations(selectErroredCalendars);
}
