import { toISOStringWithTimezone } from "@/lib/date";
import { isBlankHtml } from "@/lib/isBlankHtml";
import type {
  TaskCreateInput,
  TaskDto,
  TaskUpdateInput,
} from "@/tasks/models/task";
import type { TaskFormValues } from "@/tasks/models/taskForm";

export function taskFormValuesToCreateInput(
  values: TaskFormValues,
): TaskCreateInput {
  const input: TaskCreateInput = {
    title: values.title.trim(),
  };

  if (!isBlankHtml(values.description)) {
    input.description = values.description;
  }

  if (values.batchId) {
    // Batched tasks inherit tags/dueDate from the batch; sending them is a 400.
    input.batchId = values.batchId;
    return input;
  }

  input.tagIds = values.tagIds;
  if (values.dueDate) {
    // Mantine's DateTimePicker onChange emits a string, so the field may be a
    // string at runtime despite its Date type — normalize before serializing.
    input.dueDate = toISOStringWithTimezone(new Date(values.dueDate));
  }

  return input;
}

export function taskFormValuesToUpdateInput(
  values: TaskFormValues,
  id: string,
): TaskUpdateInput {
  const input: TaskUpdateInput = {
    id,
    title: values.title.trim(),
    description: isBlankHtml(values.description) ? null : values.description,
    status: values.status,
  };

  if (values.batchId) {
    // Tags and due date are managed at batch level for batched tasks.
    return input;
  }

  input.tagIds = values.tagIds;
  input.dueDate = values.dueDate
    ? toISOStringWithTimezone(new Date(values.dueDate))
    : null;

  return input;
}

export function taskDtoToFormValues(task: TaskDto): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    tagIds: task.tagIds,
    batchId: task.batchId ?? undefined,
  };
}
