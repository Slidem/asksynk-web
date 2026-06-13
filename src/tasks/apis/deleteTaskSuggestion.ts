import { apiFetch, buildApiUrl } from "@/lib/api";

export async function deleteTaskSuggestion(id: string): Promise<void> {
  const response = await apiFetch(buildApiUrl(`/task-suggestions/${id}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task suggestion");
  }
}
