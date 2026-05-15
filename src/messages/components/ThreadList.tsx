import {
  ActionIcon,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useNewThreadDialogHandlers } from "@/messages/hooks/dialogs/newThreadDialogHooks";
import { useThreadsQuery } from "@/messages/hooks/queries/useThreadsQuery";
import { EmptyMessagesState } from "@/messages/components/EmptyMessagesState";
import { ThreadListItem } from "@/messages/components/ThreadListItem";

export function ThreadList() {
  const { data: threads, isLoading, isError } = useThreadsQuery();
  const { open } = useNewThreadDialogHandlers();

  if (isLoading) {
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="100%">
        <Text c="red">Failed to load conversations.</Text>
      </Center>
    );
  }

  if (!threads || threads.length === 0) {
    return <EmptyMessagesState />;
  }

  return (
    <Stack gap={0} h="100%">
      <Group
        justify="space-between"
        px="md"
        py="sm"
        style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
      >
        <Title order={4}>Messages</Title>
        <ActionIcon
          aria-label="New conversation"
          variant="subtle"
          onClick={open}
        >
          <IconPlus size={20} />
        </ActionIcon>
      </Group>
      <ScrollArea flex={1} scrollbars="y">
        <Stack gap={2} p="xs">
          {threads.map((thread) => (
            <ThreadListItem key={thread.threadId} thread={thread} />
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
