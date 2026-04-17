import { apiFetch, buildApiUrl } from "@/lib/api";
import type { CalendarDto } from "@/schedule/models/calendarEventDto";

export async function ensureCalendar(): Promise<CalendarDto> {
  const response = await apiFetch(buildApiUrl("/calendars"), {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to ensure calendar");
  return response.json();
}
