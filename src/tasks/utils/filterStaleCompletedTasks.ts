import dayjs from "dayjs";

import type { TaskDto } from "@/tasks/models/task";

// Hide standalone tasks completed more than 1 day ago, proxying completion time
// with updatedAt (no completedAt on TaskDto). Batch children are kept so batch
// progress and visibility are unaffected.
export function filterStaleCompletedTasks(tasks: TaskDto[]): TaskDto[] {
  const cutoff = dayjs().subtract(1, "day");
  return tasks.filter(
    (t) =>
      !(
        t.batchId === null &&
        t.status === "completed" &&
        dayjs(t.updatedAt).isBefore(cutoff)
      ),
  );
}
