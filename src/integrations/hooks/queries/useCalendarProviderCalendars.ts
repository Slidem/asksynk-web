import type { CalendarIntegrationDto } from "@/integrations/models/calendarIntegration";
import { isCalendarProvider } from "@/integrations/models/provider";
import { useCalendarIntegrations } from "./useCalendarIntegrations";

export interface SyncedProviderCalendar {
  id: string;
  name: string | null;
  color: string | null;
  integrationId: string;
  provider: string;
}

// Module-scoped so react-query memoizes the select result by data identity.
function selectSyncedCalendars(
  integrations: CalendarIntegrationDto[],
): Map<string, SyncedProviderCalendar> {
  const map = new Map<string, SyncedProviderCalendar>();
  for (const integration of integrations) {
    if (!isCalendarProvider(integration.provider)) continue;
    for (const calendar of integration.calendars) {
      if (!calendar.syncEnabled) continue;
      map.set(calendar.id, {
        id: calendar.id,
        name: calendar.name,
        color: calendar.color,
        integrationId: integration.id,
        provider: integration.provider,
      });
    }
  }
  return map;
}

/** Map of enabled provider calendars (calendar-kind only), keyed by calendarId. */
export function useCalendarProviderCalendars() {
  return useCalendarIntegrations(selectSyncedCalendars);
}
