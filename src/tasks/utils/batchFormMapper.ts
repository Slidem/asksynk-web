import { toISOStringWithTimezone } from "@/lib/date";
import type {
  BatchChildTaskInput,
  TaskBatchCreateInput,
} from "@/tasks/models/taskBatch";
import type { BatchFormValues } from "@/tasks/models/taskForm";

export function batchFormValuesToCreateInput(
  values: BatchFormValues,
): TaskBatchCreateInput {
  const input: TaskBatchCreateInput = {
    title: values.title.trim(),
    tagIds: values.tagIds,
    tasks: values.tasks.map(toChildInput),
  };

  const description = values.description.trim();
  if (description) {
    input.description = description;
  }
  if (values.dueDate) {
    input.dueDate = toISOStringWithTimezone(new Date(values.dueDate));
  }

  return input;
}

function toChildInput(
  child: BatchFormValues["tasks"][number],
): BatchChildTaskInput {
  const childInput: BatchChildTaskInput = {
    title: child.title.trim(),
  };

  const description = child.description.trim();
  if (description) {
    childInput.description = description;
  }

  return childInput;
}
