import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TimerSettings } from "@/timer/models/timer";

export async function fetchTimerSettings() {
  const response = await apiFetch(buildApiUrl("/timers/settings"));

  if (!response.ok) {
    throw new Error("Failed to fetch timer settings");
  }

  return response.json() as Promise<TimerSettings>;
}
