import { apiFetch, buildApiUrl } from "@/lib/api";
import { toISOStringWithTimezone } from "@/lib/date";
import type { CalendarEventInstanceDto } from "@/schedule/models/calendarEventDto";

export async function fetchPublicCalendarEvents(
  start: Date,
  end: Date,
  timezone: string,
): Promise<CalendarEventInstanceDto[]> {
  const params = new URLSearchParams({
    start: toISOStringWithTimezone(start),
    end: toISOStringWithTimezone(end),
    timezone,
  });

  const response = await apiFetch(
    buildApiUrl(`/calendar-events?${params.toString()}`),
    { allowGuestSession: true },
  );

  if (!response.ok) {
    throw new Error("Failed to load events");
  }

  return response.json();
}
