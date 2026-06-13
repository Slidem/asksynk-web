import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TaskBatch } from "@/tasks/models/taskBatch";

export async function fetchTaskBatch(id: string): Promise<TaskBatch> {
  const response = await apiFetch(buildApiUrl(`/task-batches/${id}`));

  if (!response.ok) {
    throw new Error("Failed to load task batch");
  }

  return response.json();
}
