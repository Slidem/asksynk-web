import { apiFetch, buildApiUrl } from "@/lib/api";
import { toApiError } from "@/lib/apiError";
import type { Timer, TimerCommandRequest } from "@/timer/models/timer";

export async function sendTimerCommand(input: TimerCommandRequest) {
  const response = await apiFetch(buildApiUrl("/timers"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await toApiError(response, "Failed to update timer");
  }

  return response.json() as Promise<Timer>;
}
