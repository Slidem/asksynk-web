import { apiFetch, buildApiUrl } from "@/lib/api";
import type { PublicTaggedMessageStats } from "@/public-schedule/models/publicTaggedMessage";

// TODO(missingApis): ASK-12 — resolved/pending counts of the guest's tagged
// messages. Endpoint does not exist yet (see missingApis/ASK-12.md); the query
// hook is disabled until it ships.
export async function fetchPublicTaggedMessageStats(): Promise<PublicTaggedMessageStats> {
  const response = await apiFetch(
    buildApiUrl("/public/thread/tagged-messages/stats"),
    { allowGuestSession: true },
  );

  if (!response.ok) {
    throw new Error("Failed to load tagged message stats");
  }
  return response.json();
}
