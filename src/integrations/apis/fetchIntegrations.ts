import { apiFetch, buildApiUrl } from "@/lib/api";
import type { CalendarIntegrationDto } from "@/integrations/models/calendarIntegration";

export async function fetchIntegrations(): Promise<CalendarIntegrationDto[]> {
  const response = await apiFetch(buildApiUrl("/calendar-integrations"));

  if (!response.ok) {
    throw new Error("Failed to load integrations");
  }

  return response.json();
}
