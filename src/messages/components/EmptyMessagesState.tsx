import { Button, Center, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconMessages } from "@tabler/icons-react";
import { useNewThreadDialogHandlers } from "@/messages/hooks/dialogs/newThreadDialogHooks";

export function EmptyMessagesState() {
  const { open } = useNewThreadDialogHandlers();

  return (
    <Center h="100%" px="md">
      <Stack align="center" gap="md" maw={420} ta="center">
        <ThemeIcon variant="light" size={72} radius="xl">
          <IconMessages size={40} />
        </ThemeIcon>
        <Stack gap={4} align="center">
          <Title order={3}>No conversations yet</Title>
          <Text c="dimmed" size="sm">
            Reach out to someone in your network to get the ball rolling.
          </Text>
        </Stack>
        <Button onClick={open}>Start your first conversation</Button>
      </Stack>
    </Center>
  );
}
