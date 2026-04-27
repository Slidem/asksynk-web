import { buildApiUrl } from "@/lib/api";
import type { PublicMeDto } from "@/public-schedule/models/publicView";
import { guestApiFetch } from "@/public-schedule/utils/guestApiFetch";

export async function fetchPublicMe(): Promise<PublicMeDto> {
  const response = await guestApiFetch(buildApiUrl("/public/me"));

  if (!response.ok) {
    throw new Error("Failed to load session");
  }

  return response.json();
}
