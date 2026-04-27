import { apiFetch, buildApiUrl } from "@/lib/api";
import type { InviteDto } from "@/network/models/invite";

export async function fetchSentInvites(): Promise<InviteDto[]> {
  const response = await apiFetch(buildApiUrl("/invites/sent"));
  if (!response.ok) throw new Error("Failed to load sent invites");
  return response.json();
}
