import { Group, Stack, Text, Title } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";

export function SchedulePageHeader() {
  return (
    <Stack gap={4}>
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Group gap="xs">
            <IconCalendar size={22} />
            <Title order={2}>Schedule</Title>
          </Group>
          <Text size="sm" c="dimmed">
            Manage your schedule and organize your notifications. Integrate the
            calendar with your favorite tools for bi-directional sync.
          </Text>
        </Stack>
      </Group>
    </Stack>
  );
}
