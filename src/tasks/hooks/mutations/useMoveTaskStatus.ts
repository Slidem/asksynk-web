import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { updateTask } from "@/tasks/apis/updateTask";
import type { TaskDto, TaskStatus } from "@/tasks/models/task";
import { useTasksQueryData } from "@/tasks/hooks/queries/useTasksQueryData";
import { useQueryClient } from "@tanstack/react-query";

interface MoveTaskStatusInput {
  id: string;
  status: TaskStatus;
}

// Kanban drag → status change. The task stays in the same list cache; only its
// column changes, so the optimistic flip is exact. skipInvalidateOnSuccess
// avoids a refetch flicker mid-drag (rollback on error is built into the hook).
export function useMoveTaskStatus() {
  const queryClient = useQueryClient();
  const { queryKey } = useTasksQueryData();
  const mutation = useOptimisticMutation<TaskDto[], MoveTaskStatusInput>({
    queryKey,
    mutationFn: ({ id, status }) => updateTask({ id, status }),
    updater: (previous, { id, status }) =>
      (previous ?? []).map((task) =>
        task.id === id ? { ...task, status } : task,
      ),
    skipInvalidateOnSuccess: true,
    onSuccess: () => {
      // Batch detail embeds task statuses; refresh any mounted batch queries.
      queryClient.invalidateQueries({ queryKey: ["task-batches"] });
    },
  });

  return { moveTaskStatus: mutation.mutate, isMoving: mutation.isPending };
}
