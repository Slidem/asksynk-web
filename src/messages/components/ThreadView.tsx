import { Center, Loader, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { MessageComposer } from "@/messages/components/MessageComposer";
import { MessageList } from "@/messages/components/MessageList";
import { ThreadHeader } from "@/messages/components/ThreadHeader";
import { useThreadsQuery } from "@/messages/hooks/queries/useThreadsQuery";
import { useThreadSubscription } from "@/messages/hooks/useThreadSubscription";

interface Props {
  threadId: string;
}

export function ThreadView({ threadId }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: threads, isFetching } = useThreadsQuery();
  useThreadSubscription(threadId);

  const thread = threads?.find((t) => t.threadId === threadId);

  if (!thread) {
    if (isFetching) {
      return (
        <Center h="100%">
          <Loader />
        </Center>
      );
    }
    return (
      <Center h="100%">
        <Text c="dimmed">Conversation not found.</Text>
      </Center>
    );
  }

  const recipientUserId =
    thread.other.kind === "user" ? thread.other.userId : null;

  return (
    <Stack gap={0} h="100%">
      <ThreadHeader other={thread.other} showBack={!isDesktop} />
      <MessageList
        threadId={threadId}
        other={thread.other}
        recipientUserId={recipientUserId}
      />
      <MessageComposer
        key={threadId}
        threadId={threadId}
        frozen={thread.frozen}
        recipientUserId={recipientUserId}
      />
    </Stack>
  );
}
