import { useTasks } from "@/tasks/hooks/queries/useTasks";

// A single task derived from the canonical ["tasks"] cache (filter in select).
export function useTask(id: string | undefined) {
  return useTasks((tasks) => tasks.find((task) => task.id === id));
}
