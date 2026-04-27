import { apiFetch, buildApiUrl } from "@/lib/api";

export async function revokePublicView(publicViewId: string): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/public-views/${publicViewId}`), {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to revoke public view");
}
