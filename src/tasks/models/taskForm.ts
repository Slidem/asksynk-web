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

export interface BatchChildFormValues {
  title: string;
  description: string;
}

export interface BatchFormValues {
  title: string;
  description: string;
  dueDate: Date | null;
  tagIds: string[];
  tasks: BatchChildFormValues[];
}

export function makeEmptyBatchChild(): BatchChildFormValues {
  return { title: "", description: "" };
}

export const DEFAULT_BATCH_FORM_VALUES: BatchFormValues = {
  title: "",
  description: "",
  dueDate: null,
  tagIds: [],
  tasks: [makeEmptyBatchChild()],
};

export interface SuggestionChildFormValues {
  title: string;
  description: string;
}

export interface SuggestionFormValues {
  suggesteeUserId: string;
  kind: SuggestionKind;
  title: string;
  description: string;
  dueDate: Date | null;
  tagIds: string[];
  tasks: SuggestionChildFormValues[]; // batch kind only
}

export function makeEmptySuggestionChild(): SuggestionChildFormValues {
  return { title: "", description: "" };
}

export const DEFAULT_SUGGESTION_FORM_VALUES: SuggestionFormValues = {
  suggesteeUserId: "",
  kind: "task",
  title: "",
  description: "",
  dueDate: null,
  tagIds: [],
  tasks: [makeEmptySuggestionChild()],
};
