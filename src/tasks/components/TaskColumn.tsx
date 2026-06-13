import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { TASK_STATUS_LABELS, type TaskStatus } from "@/tasks/models/task";
import type { TaskBatch } from "@/tasks/models/taskBatch";
import { BatchBoardCard } from "@/tasks/components/BatchBoardCard";
import { QuickAddTaskCard } from "@/tasks/components/QuickAddTaskCard";
import { TaskCard } from "@/tasks/components/TaskCard";
import type { BoardItem } from "@/tasks/utils/groupBoardItems";

interface Props {
  status: TaskStatus;
  items: BoardItem[];
  batchesById: Map<string, TaskBatch>;
  registerNode: (id: string) => (el: HTMLElement | null) => void;
  highlightedId: string | null;
}

export function TaskColumn({
  status,
  items,
  batchesById,
  registerNode,
  highlightedId,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  // Only standalone tasks are draggable; batches move by their children's
  // statuses, not by drag.
  const sortableIds = items.flatMap((item) =>
    item.type === "task" ? [item.task.id] : [],
  );

  return (
    <Paper
      ref={setNodeRef}
      withBorder
      radius="md"
      p="sm"
      bg={isOver ? "var(--mantine-color-blue-light)" : undefined}
      style={{ flex: 1, minWidth: 0, alignSelf: "flex-start" }}
    >
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={600} size="sm">
            {TASK_STATUS_LABELS[status]}
          </Text>
          <Badge size="sm" variant="light" color="gray">
            {items.length}
          </Badge>
        </Group>

        {status === "todo" && <QuickAddTaskCard />}

        <SortableContext
          items={sortableIds}
          strategy={verticalListSortingStrategy}
        >
          <Stack gap="xs" mih={40}>
            {items.map((item) =>
              item.type === "task" ? (
                <TaskCard
                  key={item.task.id}
                  task={item.task}
                  flashRef={registerNode(item.task.id)}
                  highlighted={highlightedId === item.task.id}
                />
              ) : (
                <BatchBoardCard
                  key={item.batchId}
                  batchId={item.batchId}
                  tasks={item.tasks}
                  batch={batchesById.get(item.batchId)}
                  flashRef={registerNode(item.batchId)}
                  highlighted={highlightedId === item.batchId}
                />
              ),
            )}
          </Stack>
        </SortableContext>
      </Stack>
    </Paper>
  );
}
