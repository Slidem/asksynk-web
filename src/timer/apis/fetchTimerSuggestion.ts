import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TimerSuggestion } from "@/timer/models/timer";

export async function fetchTimerSuggestion() {
  const response = await apiFetch(buildApiUrl("/timers/suggestion"));

  if (!response.ok) {
    throw new Error("Failed to fetch timer suggestion");
  }

  return response.json() as Promise<TimerSuggestion>;
}
