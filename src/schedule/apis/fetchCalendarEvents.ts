import { apiFetch, buildApiUrl } from "@/lib/api";
import { toISOStringWithTimezone } from "@/lib/date";
import type { CalendarEventInstanceDto } from "@/schedule/models/calendarEventDto";

export async function fetchCalendarEvents(
  start: Date,
  end: Date,
  timezone: string,
  userId?: string | null,
): Promise<CalendarEventInstanceDto[]> {
  const params = new URLSearchParams({
    start: toISOStringWithTimezone(start),
    end: toISOStringWithTimezone(end),
    timezone,
  });

  if (userId) {
    params.append("userId", userId);
  }

  const response = await apiFetch(
    buildApiUrl(`/calendar-events?${params.toString()}`),
  );

  if (!response.ok) throw new Error("Failed to fetch calendar events");
  return response.json();
}
