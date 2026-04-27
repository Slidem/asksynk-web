import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  CreatePublicViewInput,
  PublicViewDto,
} from "@/public-views/models/publicView";

export async function createPublicView(
  input: CreatePublicViewInput,
): Promise<PublicViewDto> {
  const response = await apiFetch(buildApiUrl("/public-views"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? "Failed to create public view");
  }
  return response.json();
}
