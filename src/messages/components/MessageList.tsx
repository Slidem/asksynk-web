import { Center, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { useSession } from "@/auth";
import { MessageBubble } from "@/messages/components/MessageBubble";
import { useThreadMessagesQuery } from "@/messages/hooks/queries/useThreadMessagesQuery";
import type { Message } from "@/messages/models/message";
import type { ThreadOtherParticipant } from "@/messages/models/thread";
import { useEffect, useMemo, useRef } from "react";

interface Props {
  threadId: string;
  other: ThreadOtherParticipant;
}

export function MessageList({ threadId, other }: Props) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useThreadMessagesQuery(threadId);

  const viewportRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const messagesAsc = useMemo<Message[]>(() => {
    if (!data) return [];
    const all = data.pages.flat();
    return [...all].reverse();
  }, [data]);

  useEffect(() => {
    const last = messagesAsc[messagesAsc.length - 1];
    if (!last) {
      return;
    }
    if (last.id === lastMessageIdRef.current) {
      return;
    }
    lastMessageIdRef.current = last.id;
    const el = viewportRef.current;
    if (!el) {
      return;
    }
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messagesAsc]);

  const handleScrollPositionChange = ({ y }: { x: number; y: number }) => {
    if (y > 60) {
      return;
    }
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }
    fetchNextPage();
  };

  if (isLoading) {
    return (
      <Center flex={1}>
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center flex={1}>
        <Text c="red">Failed to load messages.</Text>
      </Center>
    );
  }

  if (messagesAsc.length === 0) {
    return (
      <Center flex={1}>
        <Text c="dimmed">No messages yet. Say hi.</Text>
      </Center>
    );
  }

  return (
    <ScrollArea
      flex={1}
      viewportRef={viewportRef}
      onScrollPositionChange={handleScrollPositionChange}
      px="md"
      py="sm"
    >
      <Stack gap="sm">
        {isFetchingNextPage && (
          <Center py="xs">
            <Loader size="xs" />
          </Center>
        )}
        {messagesAsc.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            other={other}
            isOwn={
              message.senderKind === "user" &&
              message.senderId === currentUserId
            }
          />
        ))}
      </Stack>
    </ScrollArea>
  );
}
