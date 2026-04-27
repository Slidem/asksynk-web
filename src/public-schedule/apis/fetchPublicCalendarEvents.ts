import { buildApiUrl } from "@/lib/api";
import { toISOStringWithTimezone } from "@/lib/date";
import type { CalendarEventInstanceDto } from "@/schedule/models/calendarEventDto";
import { guestApiFetch } from "@/public-schedule/utils/guestApiFetch";

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

  const response = await guestApiFetch(
    buildApiUrl(`/public/calendar-events?${params.toString()}`),
  );

  if (!response.ok) {
    throw new Error("Failed to load events");
  }

  return response.json();
}
