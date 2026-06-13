import { Group, Paper, Skeleton, Stack } from "@mantine/core";

import { TASK_STATUS_ORDER } from "@/tasks/models/task";

export function TaskBoardSkeleton() {
  return (
    <Group align="flex-start" gap="md" grow wrap="nowrap">
      {TASK_STATUS_ORDER.map((status) => (
        <Paper key={status} withBorder radius="md" p="sm">
          <Stack gap="xs">
            <Skeleton height={16} width="40%" />
            <Skeleton height={64} radius="md" />
            <Skeleton height={64} radius="md" />
          </Stack>
        </Paper>
      ))}
    </Group>
  );
}
