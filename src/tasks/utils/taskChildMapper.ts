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

  const description = child.description.trim();
  if (description) {
    input.description = description;
  }

  return input;
}
