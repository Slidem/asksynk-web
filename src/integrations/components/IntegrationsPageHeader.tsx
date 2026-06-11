import { Group, Stack, Text, Title } from "@mantine/core";
import { IconPlugConnected } from "@tabler/icons-react";

export function IntegrationsPageHeader() {
  return (
    <Stack gap={4}>
      <Group gap="xs">
        <IconPlugConnected size={22} />
        <Title order={2}>Integrations</Title>
      </Group>
      <Text size="sm" c="dimmed">
        Connect your calendars and tools. Imported calendar events appear on your
        schedule and stay read-only.
      </Text>
    </Stack>
  );
}
