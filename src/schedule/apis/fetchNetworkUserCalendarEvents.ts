import { apiFetch, buildApiUrl } from "@/lib/api";
import { toISOStringWithTimezone } from "@/lib/date";
import type { CalendarEventInstanceDto } from "@/schedule/models/calendarEventDto";

// TODO: backend must implement GET /network/:userId/calendar-events
export async function fetchNetworkUserCalendarEvents(
  userId: string,
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
    buildApiUrl(`/network/${userId}/calendar-events?${params.toString()}`),
  );
  if (!response.ok) throw new Error("Failed to fetch network user calendar events");
  return response.json();
}
