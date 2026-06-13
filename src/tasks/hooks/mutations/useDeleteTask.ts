import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { deleteTask } from "@/tasks/apis/deleteTask";
import type { TaskDto } from "@/tasks/models/task";
import { useTasksQueryData } from "@/tasks/hooks/queries/useTasksQueryData";

export function useDeleteTask() {
  const { queryKey } = useTasksQueryData();
  const mutation = useOptimisticMutation<TaskDto[], string>({
    queryKey,
    mutationFn: deleteTask,
    updater: (previous, id) => (previous ?? []).filter((task) => task.id !== id),
    skipInvalidateOnSuccess: true,
  });

  return { deleteTask: mutation.mutate, isDeleting: mutation.isPending };
}
