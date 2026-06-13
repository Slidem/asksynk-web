import { apiFetch, buildApiUrl } from "@/lib/api";

export async function deleteTask(id: string): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/tasks/${id}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}
