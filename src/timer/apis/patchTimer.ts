import { apiFetch, buildApiUrl } from "@/lib/api";
import type { PatchTimerInput, Timer } from "@/timer/models/timer";

export async function patchTimer(input: PatchTimerInput) {
  const response = await apiFetch(buildApiUrl("/timers"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to update timer");
  }

  return response.json() as Promise<Timer>;
}
