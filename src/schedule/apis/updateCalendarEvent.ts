import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  CalendarEventInstanceDto,
  UpdateCalendarEventInput,
} from "@/schedule/models/calendarEventDto";

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
