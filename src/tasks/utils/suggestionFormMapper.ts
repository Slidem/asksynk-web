import { toISOStringWithTimezone } from "@/lib/date";
import type { SuggestionFormValues } from "@/tasks/models/taskForm";
import type {
  SuggestionTaskChild,
  TaskSuggestionCreateInput,
  TaskSuggestionCreatePayload,
  TaskSuggestionPayloadEditInput,
} from "@/tasks/models/taskSuggestion";

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
    payload.tasks = values.tasks.map(toChildInput);
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
    input.tasks = values.tasks.map(toChildInput);
  }

  return input;
}

function toChildInput(
  child: SuggestionFormValues["tasks"][number],
): SuggestionTaskChild {
  const item: SuggestionTaskChild = { title: child.title.trim() };
  const description = child.description.trim();
  if (description) {
    item.description = description;
  }
  return item;
}
