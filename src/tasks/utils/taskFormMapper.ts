import { toISOStringWithTimezone } from "@/lib/date";
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

  const description = values.description.trim();
  if (description) {
    input.description = description;
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
    description: values.description.trim() || null,
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
