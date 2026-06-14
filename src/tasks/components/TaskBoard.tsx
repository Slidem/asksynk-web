import { SimpleGrid } from "@mantine/core";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";

import { TASK_STATUS_ORDER, type TaskStatus } from "@/tasks/models/task";
import type { TaskDto } from "@/tasks/models/task";
import { TaskBoardSkeleton } from "@/tasks/components/TaskBoardSkeleton";
import { TaskCardOverlay } from "@/tasks/components/TaskCardOverlay";
import { TaskColumn } from "@/tasks/components/TaskColumn";
import { useFocusFlash } from "@/tasks/hooks/useFocusFlash";
import { useMoveTaskStatus } from "@/tasks/hooks/mutations/useMoveTaskStatus";
import { useTaskBatches } from "@/tasks/hooks/queries/useTaskBatches";
import { useTasks } from "@/tasks/hooks/queries/useTasks";
import { filterStaleCompletedTasks } from "@/tasks/utils/filterStaleCompletedTasks";
import { groupBoardItems } from "@/tasks/utils/groupBoardItems";

interface Props {
  focusTaskId?: string;
  focusBatchId?: string;
}

function resolveTargetStatus(
  overId: string,
  tasks: TaskDto[],
): TaskStatus | null {
  if (TASK_STATUS_ORDER.includes(overId as TaskStatus)) {
    return overId as TaskStatus;
  }
  const overTask = tasks.find((t) => t.id === overId);
  return overTask ? overTask.status : null;
}

export function TaskBoard({ focusTaskId, focusBatchId }: Props) {
  const { data: tasks = [], isFetching } = useTasks();
  const { moveTaskStatus } = useMoveTaskStatus();
  const [activeId, setActiveId] = useState<string | null>(null);

  // 5px gate distinguishes a click (open edit) from a drag (move status).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const grouped = useMemo(
    () => groupBoardItems(filterStaleCompletedTasks(tasks)),
    [tasks],
  );

  const batchIds = useMemo(
    () =>
      Array.from(new Set(tasks.flatMap((t) => (t.batchId ? [t.batchId] : [])))),
    [tasks],
  );
  const batchesById = useTaskBatches(batchIds);

  const { registerNode, highlightedId } = useFocusFlash(
    focusTaskId ?? focusBatchId,
    tasks,
  );

  const activeTask = activeId
    ? tasks.find((t) => t.id === activeId)
    : undefined;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const target = resolveTargetStatus(String(over.id), tasks);
    const current = tasks.find((t) => t.id === taskId);
    if (!current || !target || current.status === target) return;

    moveTaskStatus({ id: taskId, status: target });
  }

  if (isFetching && tasks.length === 0) {
    return <TaskBoardSkeleton />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" verticalSpacing="md">
        {TASK_STATUS_ORDER.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            items={grouped[status]}
            batchesById={batchesById}
            registerNode={registerNode}
            highlightedId={highlightedId}
          />
        ))}
      </SimpleGrid>

      <DragOverlay>
        {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
