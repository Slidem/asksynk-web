import { apiFetch, buildApiUrl } from "@/lib/api";
import type { CalendarEventInstanceDto } from "@/schedule/models/calendarEventDto";

export async function fetchCalendarEvent(
  id: string,
): Promise<CalendarEventInstanceDto> {
  const response = await apiFetch(buildApiUrl(`/calendar-events/${id}`));
  if (!response.ok) throw new Error("Failed to fetch calendar event");
  return response.json();
}
