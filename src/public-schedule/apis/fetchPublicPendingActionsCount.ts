import { apiFetch, buildApiUrl } from "@/lib/api";

// TODO(missingApis): ASK-11 — backend has no guest-scoped pending-actions
// count endpoint yet. Spec recorded in missingApis/ASK-11.md. Wired but the
// calling query is disabled until the endpoint ships.
export interface PublicPendingActionsCountDto {
  count: number;
}

export async function fetchPublicPendingActionsCount(): Promise<number> {
  const response = await apiFetch(
    buildApiUrl("/public/pending-actions/count"),
    { allowGuestSession: true },
  );

  if (!response.ok) {
    throw new Error("Failed to load pending actions count");
  }

  const data: PublicPendingActionsCountDto = await response.json();
  return data.count;
}
