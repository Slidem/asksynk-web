import { Center, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { useSession } from "@/auth";
import { MessageBubble } from "@/messages/components/MessageBubble";
import { useMessageRepliesQuery } from "@/messages/hooks/queries/useMessageRepliesQuery";
import type { Message } from "@/messages/models/message";
import type { ThreadOtherParticipant } from "@/messages/models/thread";
import { useEffect, useMemo, useRef } from "react";

interface Props {
  threadId: string;
  messageId: string;
  other: ThreadOtherParticipant;
  recipientUserId: string | null;
}

const GROUP_GAP_MS = 5 * 60 * 1000;

interface SenderInfo {
  name: string | null;
  email: string | null;
  image: string | null;
}

interface DisplayMessage {
  message: Message;
  sender: SenderInfo;
  showHeader: boolean;
  isOwn: boolean;
}

export function ReplyList({
  threadId,
  messageId,
  other,
  recipientUserId,
}: Props) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const currentUserName = session?.user?.name ?? null;
  const currentUserEmail = session?.user?.email ?? null;
  const currentUserImage = session?.user?.image ?? null;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessageRepliesQuery(threadId, messageId);

  const viewportRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const otherSender = useMemo<SenderInfo>(() => {
    if (other.kind === "user") {
      return {
        name: other.name ?? null,
        email: other.email ?? null,
        image: other.image ?? null,
      };
    }
    return { name: other.displayName, email: null, image: null };
  }, [other]);

  const displayMessages = useMemo<DisplayMessage[]>(() => {
    if (!data) {
      return [];
    }
    const asc = [...data.pages.flat()].reverse();
    return asc.map((message, i) => {
      const isOwn =
        message.senderKind === "user" && message.senderId === currentUserId;
      const sender: SenderInfo = isOwn
        ? {
            name: currentUserName,
            email: currentUserEmail,
            image: currentUserImage,
          }
        : otherSender;
      const prev = asc[i - 1];
      const showHeader =
        !prev ||
        prev.senderKind !== message.senderKind ||
        prev.senderId !== message.senderId ||
        new Date(message.createdAt).getTime() -
          new Date(prev.createdAt).getTime() >
          GROUP_GAP_MS;
      return { message, sender, showHeader, isOwn };
    });
  }, [
    data,
    currentUserId,
    currentUserName,
    currentUserEmail,
    currentUserImage,
    otherSender,
  ]);

  useEffect(() => {
    const last = displayMessages[displayMessages.length - 1];
    if (!last) {
      return;
    }
    if (last.message.id === lastMessageIdRef.current) {
      return;
    }
    lastMessageIdRef.current = last.message.id;
    const el = viewportRef.current;
    if (!el) {
      return;
    }
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [displayMessages]);

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
        <Text c="red">Failed to load replies.</Text>
      </Center>
    );
  }

  if (displayMessages.length === 0) {
    return (
      <Center flex={1}>
        <Text c="dimmed">No replies yet.</Text>
      </Center>
    );
  }

  return (
    <ScrollArea
      flex={1}
      viewportRef={viewportRef}
      onScrollPositionChange={handleScrollPositionChange}
      scrollbars="y"
      py="sm"
    >
      <Stack gap={0}>
        {isFetchingNextPage && (
          <Center py="xs">
            <Loader size="xs" />
          </Center>
        )}
        {displayMessages.map(({ message, sender, showHeader, isOwn }) => (
          <MessageBubble
            key={message.id}
            message={message}
            sender={sender}
            showHeader={showHeader}
            isOwn={isOwn}
            recipientUserId={recipientUserId}
            canManageStatus={false}
            isReply
          />
        ))}
      </Stack>
    </ScrollArea>
  );
}
