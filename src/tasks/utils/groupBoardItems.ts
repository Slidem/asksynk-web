import type { TaskDto, TaskStatus } from "@/tasks/models/task";

export type BoardItem =
  | { type: "task"; task: TaskDto }
  | { type: "batch"; batchId: string; tasks: TaskDto[] };

// A batch follows its children: completed when all are done, in progress when
// any is, todo otherwise (mixed done/todo counts as todo).
export function deriveBatchStatus(tasks: TaskDto[]): TaskStatus {
  if (tasks.length > 0 && tasks.every((t) => t.status === "completed")) {
    return "completed";
  }
  if (tasks.some((t) => t.status === "in_progress")) {
    return "in_progress";
  }
  return "todo";
}

// Standalone tasks sit in their status column; batched tasks collapse into one
// batch item placed by derived status.
export function groupBoardItems(
  tasks: TaskDto[],
): Record<TaskStatus, BoardItem[]> {
  const grouped: Record<TaskStatus, BoardItem[]> = {
    todo: [],
    in_progress: [],
    completed: [],
  };

  const batches = new Map<string, TaskDto[]>();
  for (const task of tasks) {
    if (task.batchId) {
      const batchTasks = batches.get(task.batchId) ?? [];
      batchTasks.push(task);
      batches.set(task.batchId, batchTasks);
    } else {
      grouped[task.status].push({ type: "task", task });
    }
  }

  for (const [batchId, batchTasks] of batches) {
    grouped[deriveBatchStatus(batchTasks)].push({
      type: "batch",
      batchId,
      tasks: batchTasks,
    });
  }

  return grouped;
}
