import { Card, Group, Stack, Text } from "@mantine/core";
import { IconCalendarDue, IconCircleCheck } from "@tabler/icons-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";

import type { TaskDto } from "@/tasks/models/task";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";
import { TaskDeleteButton } from "@/tasks/components/TaskDeleteButton";
import { useEditTaskDialogHandlers } from "@/tasks/hooks/dialogs/editTaskDialogHooks";
import { htmlToText } from "@/lib/htmlToText";
import { isBlankHtml } from "@/lib/isBlankHtml";
import classes from "@/tasks/components/focusFlash.module.css";

interface Props {
  task: TaskDto;
  flashRef?: (el: HTMLElement | null) => void;
  highlighted?: boolean;
}

export function TaskCard({ task, flashRef, highlighted = false }: Props) {
  const { open } = useEditTaskDialogHandlers();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={(el) => {
        setNodeRef(el);
        flashRef?.(el);
      }}
      style={style}
      className={highlighted ? classes.highlight : undefined}
      withBorder
      radius="md"
      padding="sm"
      shadow="xs"
      {...attributes}
      {...listeners}
      onClick={() => open(task)}
    >
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <IconCircleCheck size={16} color="var(--mantine-color-blue-6)" />
            <Text size="sm" fw={600} lineClamp={2}>
              {task.title}
            </Text>
          </Group>
          <TaskDeleteButton taskId={task.id} />
        </Group>

        {!isBlankHtml(task.description) && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {htmlToText(task.description)}
          </Text>
        )}

        <TaskTagChips tagIds={task.tagIds} />

        {task.dueDate && (
          <Group gap={4} wrap="nowrap" c="dimmed">
            <IconCalendarDue size={14} />
            <Text size="xs">{dayjs(task.dueDate).format("MMM D")}</Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
