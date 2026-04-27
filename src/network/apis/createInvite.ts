import { apiFetch, buildApiUrl } from "@/lib/api";
import type { CreateInviteInput, InviteDto } from "@/network/models/invite";

export async function createInvite(input: CreateInviteInput): Promise<InviteDto> {
  const response = await apiFetch(buildApiUrl("/invites"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? "Failed to send invite");
  }
  return response.json();
}
