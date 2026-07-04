import { apiFetch, buildApiUrl } from "@/lib/api";
import type { PublicTaggedMessage } from "@/public-schedule/models/publicTaggedMessage";

// TODO(missingApis): ASK-12 — guest-scoped fuzzy search over the guest's tagged
// messages. Endpoint does not exist yet (see missingApis/ASK-12.md); the query
// hook is disabled until it ships.
export async function fetchPublicTaggedMessages(
  query: string,
): Promise<PublicTaggedMessage[]> {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }

  const queryString = params.toString();
  let path = "/public/thread/tagged-messages";
  if (queryString) {
    path += `?${queryString}`;
  }

  const response = await apiFetch(buildApiUrl(path), {
    allowGuestSession: true,
  });

  if (!response.ok) {
    throw new Error("Failed to search tagged messages");
  }
  return response.json();
}
