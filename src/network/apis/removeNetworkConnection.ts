import { apiFetch, buildApiUrl } from "@/lib/api";

export async function removeNetworkConnection(
  connectionId: string,
): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/network/${connectionId}`), {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to remove connection");
}
