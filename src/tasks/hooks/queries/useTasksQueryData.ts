import { MY_TASKS_FILTERS, type TaskFilters } from "@/tasks/models/taskScope";

export function getTasksQueryKey(filters: TaskFilters) {
  return ["tasks", filters] as const;
}

const MY_TASKS_QUERY_KEY = getTasksQueryKey(MY_TASKS_FILTERS);

// The board only ever shows your own tasks; the key is constant so optimistic
// mutations and the query always agree.
export const useTasksQueryData = () => {
  return { filters: MY_TASKS_FILTERS, queryKey: MY_TASKS_QUERY_KEY };
};
