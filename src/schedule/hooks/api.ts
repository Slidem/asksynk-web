import { apiFetch, buildApiUrl } from "@/lib/api";
import { toISOStringWithTimezone } from "@/lib/date";
import type {
  CalendarDto,
  CalendarEventInstanceDto,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from "@/schedule/models/calendarEventDto";

export async function ensureCalendar(): Promise<CalendarDto> {
  const response = await apiFetch(buildApiUrl("/calendars"), {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to ensure calendar");
  return response.json();
}

export async function fetchCalendarEvents(
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
  );
  if (!response.ok) throw new Error("Failed to fetch calendar events");
  return response.json();
}

export async function fetchCalendarEvent(
  id: string,
): Promise<CalendarEventInstanceDto> {
  const response = await apiFetch(buildApiUrl(`/calendar-events/${id}`));
  if (!response.ok) throw new Error("Failed to fetch calendar event");
  return response.json();
}

export async function createCalendarEvent(
  input: CreateCalendarEventInput,
): Promise<CalendarEventInstanceDto> {
  const response = await apiFetch(buildApiUrl("/calendar-events"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to create calendar event");
  return response.json();
}

export async function updateCalendarEvent(
  id: string,
  input: UpdateCalendarEventInput,
): Promise<CalendarEventInstanceDto> {
  const response = await apiFetch(buildApiUrl(`/calendar-events/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to update calendar event");
  return response.json();
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/calendar-events/${id}`), {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete calendar event");
}

export async function cancelOccurrence(
  eventId: string,
  occurrenceStart: string,
): Promise<void> {
  const response = await apiFetch(
    buildApiUrl(`/calendar-events/${eventId}/exceptions`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ occurrenceStart }),
    },
  );
  if (!response.ok) throw new Error("Failed to cancel occurrence");
}

export async function detachInstance(
  eventId: string,
  instanceStart: string,
  input: UpdateCalendarEventInput,
): Promise<CalendarEventInstanceDto> {
  const response = await apiFetch(
    buildApiUrl(
      `/calendar-events/${eventId}/instances/${encodeURIComponent(instanceStart)}`,
    ),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  if (!response.ok) throw new Error("Failed to detach instance");
  return response.json();
}

export async function splitSeries(
  eventId: string,
  splitStart: string,
  input: UpdateCalendarEventInput,
): Promise<CalendarEventInstanceDto> {
  const response = await apiFetch(
    buildApiUrl(
      `/calendar-events/${eventId}/split/${encodeURIComponent(splitStart)}`,
    ),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  if (!response.ok) throw new Error("Failed to split series");
  return response.json();
}
