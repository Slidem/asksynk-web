import type { TaskStatus } from "@/tasks/models/task";
import type { SuggestionKind } from "@/tasks/models/taskSuggestion";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
  tagIds: string[];
  batchId?: string;
}

export const DEFAULT_TASK_FORM_VALUES: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  dueDate: null,
  tagIds: [],
};

// Shared child-row shape for batch creation AND batch suggestion: a title plus
// an optional description. Tags and dueDate live at the batch/suggestion level.
export interface TaskChildFormValues {
  title: string;
  description: string;
}

export function makeEmptyTaskChild(): TaskChildFormValues {
  return { title: "", description: "" };
}

export interface BatchFormValues {
  title: string;
  description: string;
  dueDate: Date | null;
  tagIds: string[];
  tasks: TaskChildFormValues[];
}

export const DEFAULT_BATCH_FORM_VALUES: BatchFormValues = {
  title: "",
  description: "",
  dueDate: null,
  tagIds: [],
  tasks: [makeEmptyTaskChild()],
};

export interface SuggestionFormValues {
  suggesteeUserId: string;
  kind: SuggestionKind;
  title: string;
  description: string;
  dueDate: Date | null;
  tagIds: string[];
  tasks: TaskChildFormValues[]; // batch kind only
}

export const DEFAULT_SUGGESTION_FORM_VALUES: SuggestionFormValues = {
  suggesteeUserId: "",
  kind: "task",
  title: "",
  description: "",
  dueDate: null,
  tagIds: [],
  tasks: [makeEmptyTaskChild()],
};
