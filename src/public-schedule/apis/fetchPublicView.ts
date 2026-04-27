import { apiFetch, buildApiUrl } from "@/lib/api";
import type { PublicViewMetadataDto } from "@/public-schedule/models/publicView";

export async function fetchPublicView(
  slug: string,
): Promise<PublicViewMetadataDto> {
  const response = await apiFetch(buildApiUrl(`/public/views/${slug}`), {
    credentials: "omit",
  });

  if (response.status === 404) {
    throw new Error("View not found or expired");
  }

  if (!response.ok) {
    throw new Error("Failed to load view");
  }

  return response.json();
}
