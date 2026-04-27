import { apiFetch, buildApiUrl } from "@/lib/api";
import type { GuestDto } from "@/public-views/models/guest";

export async function fetchPublicViewGuests(
  publicViewId: string,
): Promise<GuestDto[]> {
  const response = await apiFetch(
    buildApiUrl(`/public-views/${publicViewId}/guests`),
  );
  if (!response.ok) throw new Error("Failed to load guests");
  return response.json();
}
