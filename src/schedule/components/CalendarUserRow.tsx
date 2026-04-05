import { Avatar, Box, Group, Stack, Text } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";

export function CalendarUserRow() {
  return (
    <Box
      p="sm"
      style={{
        borderBottom: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Group gap="sm">
        <IconCalendar size={18} color="var(--mantine-color-dimmed)" />
        <Avatar size="sm" color="Remoraid" radius="xl">
          AM
        </Avatar>
        <Stack gap={0}>
          <Text size="sm" fw={500}>
            My Calendar
          </Text>
          <Text size="xs" c="dimmed">
            Your schedule
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}
