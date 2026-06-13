import type { TaskStatus } from "@/tasks/models/task";

export type TaskScope = "created_by_me" | "assigned_to_me";

export interface TaskFilters {
  scope: TaskScope;
  status?: TaskStatus;
  batchId?: string;
  cursor?: string;
  limit?: number;
}

export const MY_TASKS_FILTERS: TaskFilters = {
  scope: "assigned_to_me",
};
