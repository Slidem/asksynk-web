import { toISOStringWithTimezone } from "@/lib/date";
import type { SuggestionFormValues } from "@/tasks/models/taskForm";
import type {
  TaskSuggestionCreateInput,
  TaskSuggestionCreatePayload,
  TaskSuggestionPayloadEditInput,
} from "@/tasks/models/taskSuggestion";
import { taskChildFormToInput } from "@/tasks/utils/taskChildMapper";

export function suggestionFormValuesToCreateInput(
  values: SuggestionFormValues,
): TaskSuggestionCreateInput {
  const payload: TaskSuggestionCreatePayload = {
    kind: values.kind,
    title: values.title.trim(),
    tagIds: values.tagIds,
  };

  const description = values.description.trim();
  if (description) {
    payload.description = description;
  }
  if (values.dueDate) {
    payload.dueDate = toISOStringWithTimezone(new Date(values.dueDate));
  }
  if (values.kind === "batch") {
    payload.tasks = values.tasks.map(taskChildFormToInput);
  }

  return { suggesteeUserId: values.suggesteeUserId, payload };
}

export function suggestionFormValuesToPayloadEditInput(
  values: SuggestionFormValues,
  id: string,
): TaskSuggestionPayloadEditInput {
  const input: TaskSuggestionPayloadEditInput = {
    id,
    title: values.title.trim(),
    description: values.description.trim() || null,
    dueDate: values.dueDate
      ? toISOStringWithTimezone(new Date(values.dueDate))
      : null,
    tagIds: values.tagIds,
  };

  if (values.kind === "batch") {
    input.tasks = values.tasks.map(taskChildFormToInput);
  }

  return input;
}
