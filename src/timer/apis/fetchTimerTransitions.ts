import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TimerTransitions } from "@/timer/models/timer";

export async function fetchTimerTransitions() {
  const response = await apiFetch(buildApiUrl("/timers/transitions"));

  if (!response.ok) {
    throw new Error("Failed to fetch timer transitions");
  }

  return response.json() as Promise<TimerTransitions>;
}
