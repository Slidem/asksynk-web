import { TasksPage } from "@/tasks/components/TasksPage";
import { parseTasksTab, type TasksTab } from "@/tasks/models/tasksTab";
import { createFileRoute } from "@tanstack/react-router";

interface TasksSearch {
  tab: TasksTab;
  focusTaskId?: string;
  focusBatchId?: string;
  focusSuggestionId?: string;
}

export const Route = createFileRoute("/_authenticated/tasks")({
  validateSearch: (search: Record<string, string | undefined>): TasksSearch => ({
    tab: parseTasksTab(search.tab),
    focusTaskId: search.focusTaskId,
    focusBatchId: search.focusBatchId,
    focusSuggestionId: search.focusSuggestionId,
  }),
  component: TasksPage,
});
