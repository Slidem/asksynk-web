export type TasksTab = "my-tasks" | "suggested-to-me" | "suggested-by-me";

export const DEFAULT_TASKS_TAB: TasksTab = "my-tasks";

const TASKS_TABS: TasksTab[] = [
  "my-tasks",
  "suggested-to-me",
  "suggested-by-me",
];

export function parseTasksTab(value: string | undefined): TasksTab {
  return TASKS_TABS.includes(value as TasksTab)
    ? (value as TasksTab)
    : DEFAULT_TASKS_TAB;
}
