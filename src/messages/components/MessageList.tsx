import { Box, Center, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { useSession } from "@/auth";
import { MessageBubble } from "@/messages/components/MessageBubble";
import classes from "@/messages/components/MessageList.module.css";
import { useReplyPanelHandlers } from "@/messages/hooks/dialogs/replyPanelHooks";
import { useThreadMessagesQuery } from "@/messages/hooks/queries/useThreadMessagesQuery";
import { useTagMessage } from "@/messages/hooks/useTagMessage";
import type { Message } from "@/messages/models/message";
import type { ThreadOtherParticipant } from "@/messages/models/thread";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  threadId: string;
  other: ThreadOtherParticipant;
  recipientUserId: string | null;
  focusMessageId?: string;
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

export function MessageList({
  threadId,
  other,
  recipientUserId,
  focusMessageId,
}: Props) {
  const { data: session } = useSession();
  const { open: openReplyPanel } = useReplyPanelHandlers();
  const { tagMessage } = useTagMessage(threadId);
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
  } = useThreadMessagesQuery(threadId);

  const viewportRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const focusedHandledRef = useRef<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

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
    const isFirstLoad = lastMessageIdRef.current === null;
    lastMessageIdRef.current = last.message.id;
    if (isFirstLoad && focusMessageId) {
      return;
    }
    const el = viewportRef.current;
    if (!el) {
      return;
    }
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [displayMessages, focusMessageId]);

  useEffect(() => {
    if (!focusMessageId) {
      focusedHandledRef.current = null;
      return;
    }

    if (focusedHandledRef.current === focusMessageId) {
      return;
    }

    const el = messageRefs.current.get(focusMessageId);
    if (!el) {
      return;
    }

    focusedHandledRef.current = focusMessageId;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    setHighlightedId(focusMessageId);

    const timer = window.setTimeout(() => setHighlightedId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [focusMessageId, displayMessages]);

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

  if (displayMessages.length === 0) {
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
          <Box
            key={message.id}
            ref={(el: HTMLDivElement | null) => {
              if (el) messageRefs.current.set(message.id, el);
              else messageRefs.current.delete(message.id);
            }}
            className={
              highlightedId === message.id ? classes.highlight : undefined
            }
          >
            <MessageBubble
              message={message}
              sender={sender}
              showHeader={showHeader}
              isOwn={isOwn}
              recipientUserId={recipientUserId}
              canManageStatus={message.managedStatus != null && !isOwn}
              onTag={tagMessage}
              onReply={() => openReplyPanel(message.id)}
              onShowReplies={() => openReplyPanel(message.id)}
            />
          </Box>
        ))}
      </Stack>
    </ScrollArea>
  );
}
