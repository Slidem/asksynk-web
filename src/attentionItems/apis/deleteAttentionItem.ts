import { apiFetch, buildApiUrl } from "@/lib/api";

export async function deleteAttentionItem(id: string): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/attention-items/${id}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete attention item");
  }
}
