import { apiFetch, buildApiUrl } from "@/lib/api";
import type { InviteDto } from "@/network/models/invite";

export async function rejectInvite(inviteId: string): Promise<InviteDto> {
  const response = await apiFetch(buildApiUrl(`/invites/${inviteId}/reject`), {
    method: "POST",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? "Failed to reject invite");
  }
  return response.json();
}
