import { apiFetch, buildApiUrl } from "@/lib/api";
import type { CalendarEventInstanceDto } from "@/schedule/models/calendarEventDto";

export async function fetchPublicCalendarEvents(
  start: Date,
  end: Date,
): Promise<CalendarEventInstanceDto[]> {
  const params = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString(),
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
