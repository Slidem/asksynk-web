import type { Editor } from "@tiptap/core";

import { isBlankHtml } from "@/lib/isBlankHtml";
import { findTaskSuggestionMarker } from "@/messages/tiptap/TaskSuggestionMarker";
import type { TaskSuggestionCreatePayload } from "@/tasks/models/taskSuggestion";
import { taskChildFormToInput } from "@/tasks/utils/taskChildMapper";

// Pulls the batch draft off the composer marker and maps it to a create payload.
// Returns null when there's no marker, no title, or no non-empty task rows.
export function extractTaskSuggestion(
  editor: Editor,
): TaskSuggestionCreatePayload | null {
  const marker = findTaskSuggestionMarker(editor);
  if (!marker) return null;

  const { draft } = marker;
  const title = draft.title.trim();
  const tasks = draft.tasks
    .filter((t) => t.title.trim().length > 0)
    .map(taskChildFormToInput);

  if (title.length === 0 || tasks.length === 0) return null;

  const payload: TaskSuggestionCreatePayload = {
    kind: "batch",
    title,
    tagIds: draft.tagIds,
    tasks,
  };
  if (!isBlankHtml(draft.description)) payload.description = draft.description;
  if (draft.dueDate) payload.dueDate = draft.dueDate;

  return payload;
}
