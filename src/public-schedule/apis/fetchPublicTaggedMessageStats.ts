import { apiFetch, buildApiUrl } from "@/lib/api";
import type { PublicTaggedMessageStats } from "@/public-schedule/models/publicTaggedMessage";

// Per-status counts of the guest's tagged messages. Thread resolved from the
// guest session; no thread yet → all-zero counts.
export async function fetchPublicTaggedMessageStats(): Promise<PublicTaggedMessageStats> {
  const response = await apiFetch(buildApiUrl("/public/thread/stats"), {
    allowGuestSession: true,
  });

  if (!response.ok) {
    throw new Error("Failed to load tagged message stats");
  }
  return response.json();
}
