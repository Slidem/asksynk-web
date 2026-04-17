import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  CalendarEventInstanceDto,
  UpdateCalendarEventInput,
} from "@/schedule/models/calendarEventDto";

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
