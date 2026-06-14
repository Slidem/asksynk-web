import { apiFetch, buildApiUrl } from "@/lib/api";

export async function deleteTaskBatch(id: string): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/task-batches/${id}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task batch");
  }
}
