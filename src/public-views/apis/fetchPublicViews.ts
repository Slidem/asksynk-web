import { apiFetch, buildApiUrl } from "@/lib/api";
import type { PublicViewDto } from "@/public-views/models/publicView";

export async function fetchPublicViews(): Promise<PublicViewDto[]> {
  const response = await apiFetch(buildApiUrl("/public-views"));
  if (!response.ok) throw new Error("Failed to load public views");
  return response.json();
}
