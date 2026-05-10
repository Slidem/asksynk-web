import { Center, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";

export function NoThreadSelected() {
  return (
    <Center h="100%">
      <Stack align="center" gap="xs">
        <ThemeIcon variant="light" size="xl" radius="xl">
          <IconMessageCircle size={28} />
        </ThemeIcon>
        <Text c="dimmed">Select a conversation to start chatting.</Text>
      </Stack>
    </Center>
  );
}
