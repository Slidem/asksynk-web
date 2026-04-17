import { apiFetch, buildApiUrl } from "@/lib/api";

export async function deleteCalendarEvent(id: string): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/calendar-events/${id}`), {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete calendar event");
}
