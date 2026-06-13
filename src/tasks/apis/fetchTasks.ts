import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TaskDto } from "@/tasks/models/task";
import type { TaskFilters } from "@/tasks/models/taskScope";

export async function fetchTasks(filters: TaskFilters): Promise<TaskDto[]> {
  const response = await apiFetch(getTasksUrl(filters));

  if (!response.ok) {
    throw new Error("Failed to load tasks");
  }

  return response.json();
}

function getTasksUrl(filters: TaskFilters) {
  const params = new URLSearchParams();
  params.set("scope", filters.scope);

  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.batchId) {
    params.set("batchId", filters.batchId);
  }
  if (filters.cursor) {
    params.set("cursor", filters.cursor);
  }
  if (typeof filters.limit === "number") {
    params.set("limit", String(filters.limit));
  }

  return buildApiUrl(`/tasks?${params.toString()}`);
}
