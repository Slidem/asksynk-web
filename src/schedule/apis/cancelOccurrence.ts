import { apiFetch, buildApiUrl } from "@/lib/api";

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
