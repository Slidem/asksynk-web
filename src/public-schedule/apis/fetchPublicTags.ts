import { apiFetch, buildApiUrl } from "@/lib/api";
import type { PublicTag } from "@/public-schedule/models/publicTag";

// TODO(missingApis): ASK-12 — the view owner's tags, exposed to guests so they
// can tag the messages they send. Endpoint does not exist yet (see
// missingApis/ASK-12.md); the query hook is disabled until it ships.
export async function fetchPublicTags(): Promise<PublicTag[]> {
  const response = await apiFetch(buildApiUrl("/public/tags"), {
    allowGuestSession: true,
  });

  if (!response.ok) {
    throw new Error("Failed to load tags");
  }
  return response.json();
}
