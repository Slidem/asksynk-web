import { fetchTasks } from "@/tasks/apis/fetchTasks";
import type { TaskDto } from "@/tasks/models/task";
import { useTasksQueryData } from "@/tasks/hooks/queries/useTasksQueryData";
import { useQuery } from "@tanstack/react-query";

export function useTasks<T = TaskDto[]>(selectFn?: (data: TaskDto[]) => T) {
  const { filters, queryKey } = useTasksQueryData();

  return useQuery({
    queryKey,
    queryFn: () => fetchTasks(filters),
    placeholderData: [],
    select: selectFn,
  });
}
