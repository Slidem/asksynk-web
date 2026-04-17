import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  CalendarEventInstanceDto,
  CreateCalendarEventInput,
} from "@/schedule/models/calendarEventDto";

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
