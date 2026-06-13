import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TaskCreateInput, TaskDto } from "@/tasks/models/task";

export async function createTask(input: TaskCreateInput): Promise<TaskDto> {
  const response = await apiFetch(buildApiUrl("/tasks"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}
