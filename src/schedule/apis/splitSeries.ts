import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  CalendarEventInstanceDto,
  UpdateCalendarEventInput,
} from "@/schedule/models/calendarEventDto";

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
