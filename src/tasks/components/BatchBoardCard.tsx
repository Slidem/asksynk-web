import {
  ActionIcon,
  Badge,
  Card,
  Collapse,
  Divider,
  Group,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconCalendarDue,
  IconChevronDown,
  IconChevronRight,
  IconStack2,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";

import { TASK_STATUS_LABELS, type TaskDto } from "@/tasks/models/task";
import type { TaskBatch } from "@/tasks/models/taskBatch";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";
import { BatchDeleteButton } from "@/tasks/components/BatchDeleteButton";
import { useTaskBatchDetailDialogHandlers } from "@/tasks/hooks/dialogs/taskBatchDetailDialogHooks";
import classes from "@/tasks/components/focusFlash.module.css";

interface Props {
  batchId: string;
  tasks: TaskDto[];
  batch?: TaskBatch;
  flashRef?: (el: HTMLElement | null) => void;
  highlighted?: boolean;
}

// Not draggable: a batch moves columns only through its children's statuses,
// changed individually in the detail dialog.
export function BatchBoardCard({
  batchId,
  tasks,
  batch,
  flashRef,
  highlighted = false,
}: Props) {
  const { open } = useTaskBatchDetailDialogHandlers();
  const [expanded, setExpanded] = useState(false);

  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <Card
      ref={(el) => flashRef?.(el)}
      className={highlighted ? classes.highlight : undefined}
      withBorder
      radius="md"
      padding="sm"
      shadow="xs"
      style={{ cursor: "pointer" }}
      onClick={() => open(batchId)}
    >
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <IconStack2 size={16} color="var(--mantine-color-grape-6)" />
            <Text size="sm" fw={600} lineClamp={2}>
              {batch?.title ?? "Batch"}
            </Text>
          </Group>
          <BatchDeleteButton
            iconOnly
            batchId={batchId}
            taskCount={tasks.length}
          />
        </Group>

        {batch && <TaskTagChips tagIds={batch.tagIds} />}

        <Group justify="space-between" align="center" gap="xs">
          <Group gap={4} wrap="nowrap" align="center">
            <Text size="xs" c="dimmed">
              {completed}/{tasks.length} done
            </Text>
            <ActionIcon
              variant="subtle"
              size="sm"
              aria-label={expanded ? "Collapse batch" : "Expand batch"}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => !prev);
              }}
            >
              {expanded ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              )}
            </ActionIcon>
          </Group>
          {batch?.dueDate && (
            <Group gap={4} wrap="nowrap" c="dimmed">
              <IconCalendarDue size={14} />
              <Text size="xs">{dayjs(batch.dueDate).format("MMM D")}</Text>
            </Group>
          )}
        </Group>
        <Progress
          value={tasks.length ? (completed / tasks.length) * 100 : 0}
          size="xs"
          color="grape"
        />

        <Collapse in={expanded}>
          <Divider mb="xs" />
          <Stack gap={6}>
            {tasks.map((task) => (
              <Group key={task.id} justify="space-between" wrap="nowrap">
                <Text size="xs" truncate style={{ minWidth: 0 }}>
                  {task.title}
                </Text>
                <Badge size="xs" variant="light">
                  {TASK_STATUS_LABELS[task.status]}
                </Badge>
              </Group>
            ))}
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
}
