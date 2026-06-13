export type TaskStatus = "todo" | "in_progress" | "completed";

export const TASK_STATUS_ORDER: TaskStatus[] = [
  "todo",
  "in_progress",
  "completed",
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  completed: "Completed",
};

export interface TaskDto {
  id: string;
  batchId: string | null;
  createdBy: string;
  assigneeUserId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
}

// Assignee is always the caller; batched tasks get tags/dueDate from the batch
// (sending them alongside batchId is a 400).
export interface TaskCreateInput {
  title: string;
  description?: string;
  dueDate?: string;
  tagIds?: string[];
  batchId?: string;
}

export interface TaskUpdateInput {
  id: string;
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
  tagIds?: string[];
}
