import { Center, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconMessage } from "@tabler/icons-react";

// Placeholder — direct owner messaging lands in ASK-12. ASK-11 ships the nav
// shell only.
export function PublicMessagesPanel() {
  return (
    <Center style={{ flex: 1, minHeight: 0 }}>
      <Stack align="center" gap="xs">
        <ThemeIcon variant="light" size="xl" radius="xl" color="gray">
          <IconMessage size={22} />
        </ThemeIcon>
        <Text fw={500}>Messaging coming soon</Text>
        <Text size="sm" c="dimmed">
          You'll be able to message the owner directly here.
        </Text>
      </Stack>
    </Center>
  );
}
