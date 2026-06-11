import { apiFetch, buildApiUrl } from "@/lib/api";

export async function disconnectIntegration(id: string): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/calendar-integrations/${id}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to disconnect integration");
  }
}
