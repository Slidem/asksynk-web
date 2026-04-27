import { apiFetch, buildApiUrl } from "@/lib/api";
import type { InviteDto } from "@/network/models/invite";

export async function fetchReceivedInvites(): Promise<InviteDto[]> {
  const response = await apiFetch(buildApiUrl("/invites/received"));
  if (!response.ok) throw new Error("Failed to load received invites");
  return response.json();
}
