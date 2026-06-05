import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TimerSettings } from "@/timer/models/timer";

export async function updateTimerSettings(input: TimerSettings) {
  const response = await apiFetch(buildApiUrl("/timers/settings"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to update timer settings");
  }

  return response.json() as Promise<TimerSettings>;
}
