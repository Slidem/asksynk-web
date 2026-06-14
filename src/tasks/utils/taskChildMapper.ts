import { isBlankHtml } from "@/lib/isBlankHtml";
import type { TaskChildFormValues } from "@/tasks/models/taskForm";

// Batch children (BatchChildTaskInput) and suggestion children
// (SuggestionTaskChild) share this shape: trimmed title + optional description.
export function taskChildFormToInput(child: TaskChildFormValues): {
  title: string;
  description?: string;
} {
  const input: { title: string; description?: string } = {
    title: child.title.trim(),
  };

  if (!isBlankHtml(child.description)) {
    input.description = child.description;
  }

  return input;
}
