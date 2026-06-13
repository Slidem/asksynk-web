import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  TaskBatch,
  TaskBatchUpdateInput,
} from "@/tasks/models/taskBatch";

export async function updateTaskBatch(
  input: TaskBatchUpdateInput,
): Promise<TaskBatch> {
  const { id, ...body } = input;
  const response = await apiFetch(buildApiUrl(`/task-batches/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to update task batch");
  }

  return response.json();
}
