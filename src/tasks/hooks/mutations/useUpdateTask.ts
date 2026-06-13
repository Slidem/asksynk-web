import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { updateTask } from "@/tasks/apis/updateTask";
import type { TaskDto, TaskUpdateInput } from "@/tasks/models/task";
import { useTasksQueryData } from "@/tasks/hooks/queries/useTasksQueryData";

export function useUpdateTask() {
  const { queryKey } = useTasksQueryData();
  const mutation = useOptimisticMutation<TaskDto[], TaskUpdateInput>({
    queryKey,
    mutationFn: updateTask,
    updater: (previous, input) =>
      (previous ?? []).map((task) =>
        task.id === input.id ? applyUpdate(task, input) : task,
      ),
  });

  return { updateTask: mutation.mutate, isUpdating: mutation.isPending };
}

function applyUpdate(task: TaskDto, input: TaskUpdateInput): TaskDto {
  return {
    ...task,
    title: input.title ?? task.title,
    description:
      input.description === undefined ? task.description : input.description,
    status: input.status ?? task.status,
    dueDate: input.dueDate === undefined ? task.dueDate : input.dueDate,
    tagIds: input.tagIds ?? task.tagIds,
  };
}
