import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TaskDto, TaskUpdateInput } from "@/tasks/models/task";

export async function updateTask(input: TaskUpdateInput): Promise<TaskDto> {
  const { id, ...body } = input;
  const response = await apiFetch(buildApiUrl(`/tasks/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}
