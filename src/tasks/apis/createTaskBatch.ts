import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  TaskBatch,
  TaskBatchCreateInput,
} from "@/tasks/models/taskBatch";

export async function createTaskBatch(
  input: TaskBatchCreateInput,
): Promise<TaskBatch> {
  const response = await apiFetch(buildApiUrl("/task-batches"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create task batch");
  }

  return response.json();
}
