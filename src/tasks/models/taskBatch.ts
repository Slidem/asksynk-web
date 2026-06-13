import type { TaskDto } from "@/tasks/models/task";

export interface BatchChildTaskInput {
  title: string;
  description?: string;
}

export interface TaskBatch {
  id: string;
  createdBy: string;
  assigneeUserId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  tagIds: string[];
  tasks: TaskDto[];
  createdAt: string;
  updatedAt: string;
}

// Tags and dueDate live at batch level; children are title/description only.
export interface TaskBatchCreateInput {
  title: string;
  description?: string;
  dueDate?: string;
  tagIds?: string[];
  tasks: BatchChildTaskInput[];
}

export interface TaskBatchUpdateInput {
  id: string;
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  tagIds?: string[];
}
