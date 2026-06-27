import { Center, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";

// Placeholder — pending-actions content is a future ticket. ASK-11 ships the
// nav shell only.
export function PublicPendingActionsPanel() {
  return (
    <Center style={{ flex: 1, minHeight: 0 }}>
      <Stack align="center" gap="xs">
        <ThemeIcon variant="light" size="xl" radius="xl" color="gray">
          <IconBell size={22} />
        </ThemeIcon>
        <Text fw={500}>No pending actions</Text>
        <Text size="sm" c="dimmed">
          Actions that need your response will show up here.
        </Text>
      </Stack>
    </Center>
  );
}
