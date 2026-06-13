import { Card, Stack, Text } from "@mantine/core";

import type { TaskDto } from "@/tasks/models/task";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";

interface Props {
  task: TaskDto;
}

// Presentational clone shown under the cursor while dragging.
export function TaskCardOverlay({ task }: Props) {
  return (
    <Card withBorder radius="md" padding="sm" shadow="md">
      <Stack gap="xs">
        <Text size="sm" fw={600} lineClamp={2}>
          {task.title}
        </Text>
        <TaskTagChips tagIds={task.tagIds} />
      </Stack>
    </Card>
  );
}
