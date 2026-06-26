import type { TaskChildFormValues } from "@/tasks/models/taskForm";

// In-composer draft of a batch task suggestion, stored on the marker node until
// the message is sent. Always a batch (kind is implied); dueDate is ISO.
export interface TaskSuggestionDraft {
  title: string;
  description: string;
  dueDate: string | null;
  tagIds: string[];
  tasks: TaskChildFormValues[];
}

export function emptyTaskSuggestionDraft(): TaskSuggestionDraft {
  return { title: "", description: "", dueDate: null, tagIds: [], tasks: [] };
}
