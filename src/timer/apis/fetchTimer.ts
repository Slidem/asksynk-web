import { apiFetch, buildApiUrl } from "@/lib/api";
import type { Timer } from "@/timer/models/timer";

export async function fetchTimer() {
  const response = await apiFetch(buildApiUrl("/timers"));

  if (!response.ok) {
    throw new Error("Failed to fetch timer");
  }

  return response.json() as Promise<Timer>;
}
