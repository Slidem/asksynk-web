import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  CalendarIntegrationDto,
  UpdateIntegrationInput,
} from "@/integrations/models/calendarIntegration";

export async function updateIntegration(
  id: string,
  input: UpdateIntegrationInput,
): Promise<CalendarIntegrationDto> {
  const response = await apiFetch(buildApiUrl(`/calendar-integrations/${id}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to update integration");
  }

  return response.json();
}
