import { toISOStringWithTimezone } from "@/lib/date";
import { isBlankHtml } from "@/lib/isBlankHtml";
import type { TaskBatchCreateInput } from "@/tasks/models/taskBatch";
import type { BatchFormValues } from "@/tasks/models/taskForm";
import { taskChildFormToInput } from "@/tasks/utils/taskChildMapper";

export function batchFormValuesToCreateInput(
  values: BatchFormValues,
): TaskBatchCreateInput {
  const input: TaskBatchCreateInput = {
    title: values.title.trim(),
    tagIds: values.tagIds,
    tasks: values.tasks.map(taskChildFormToInput),
  };

  if (!isBlankHtml(values.description)) {
    input.description = values.description;
  }
  if (values.dueDate) {
    input.dueDate = toISOStringWithTimezone(new Date(values.dueDate));
  }

  return input;
}
