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

  // allowGuestSession is a no-op off public views (see apiFetch); on a public
  // view it lets guests read the owner's calendar (e.g. tag availability hints).
  const response = await apiFetch(
    buildApiUrl(`/calendar-events?${params.toString()}`),
    { allowGuestSession: true },
  );

  if (!response.ok) throw new Error("Failed to fetch calendar events");
  return response.json();
}
