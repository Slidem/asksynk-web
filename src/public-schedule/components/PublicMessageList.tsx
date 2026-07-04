import { Box, Center, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Message } from "@/messages/models/message";
import {
  PublicMessageItem,
  type MessageSender,
} from "@/public-schedule/components/PublicMessageItem";
import classes from "@/public-schedule/components/PublicMessageList.module.css";
import { usePublicTagsQuery } from "@/public-schedule/hooks/queries/usePublicTagsQuery";
import { usePublicThreadMessagesQuery } from "@/public-schedule/hooks/queries/usePublicThreadMessagesQuery";
import { useGuestSession } from "@/public-schedule/hooks/useGuestSession";
import type { PublicTag } from "@/public-schedule/models/publicTag";

interface Props {
  slug: string;
  ownerName: string | null;
  ownerImage: string | null;
  focusMessageId?: string;
}

const GROUP_GAP_MS = 5 * 60 * 1000;

interface DisplayMessage {
  message: Message;
  sender: MessageSender;
  showHeader: boolean;
}

export function PublicMessageList({
  slug,
  ownerName,
  ownerImage,
  focusMessageId,
}: Props) {
  const guest = useGuestSession();
  const { data: tags } = usePublicTagsQuery(slug);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicThreadMessagesQuery(slug);

  const tagsById = useMemo(() => {
    const map = new Map<string, PublicTag>();
    for (const tag of tags ?? []) {
      map.set(tag.id, tag);
    }
    return map;
  }, [tags]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const focusedHandledRef = useRef<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const ownerSender = useMemo<MessageSender>(
    () => ({ name: ownerName, image: ownerImage }),
    [ownerName, ownerImage],
  );
  const selfSender = useMemo<MessageSender>(
    () => ({ name: guest?.displayName ?? "You", image: null }),
    [guest?.displayName],
  );

  const displayMessages = useMemo<DisplayMessage[]>(() => {
    if (!data) return [];
    const asc = [...data.pages.flat()].reverse();
    return asc.map((message, i) => {
      const isOwn =
        message.senderKind === "guest" && message.senderId === guest?.guestId;
      const sender = isOwn ? selfSender : ownerSender;
      const prev = asc[i - 1];
      const showHeader =
        !prev ||
        prev.senderKind !== message.senderKind ||
        prev.senderId !== message.senderId ||
        new Date(message.createdAt).getTime() -
          new Date(prev.createdAt).getTime() >
          GROUP_GAP_MS;
      return { message, sender, showHeader };
    });
  }, [data, guest?.guestId, selfSender, ownerSender]);

  useEffect(() => {
    const last = displayMessages[displayMessages.length - 1];
    if (!last) return;
    if (last.message.id === lastMessageIdRef.current) return;
    const isFirstLoad = lastMessageIdRef.current === null;
    lastMessageIdRef.current = last.message.id;
    if (isFirstLoad && focusMessageId) return;
    const el = viewportRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [displayMessages, focusMessageId]);

  useEffect(() => {
    if (!focusMessageId) {
      focusedHandledRef.current = null;
      return;
    }
    if (focusedHandledRef.current === focusMessageId) return;
    const el = messageRefs.current.get(focusMessageId);
    if (!el) return;
    focusedHandledRef.current = focusMessageId;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    setHighlightedId(focusMessageId);
    const timer = window.setTimeout(() => setHighlightedId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [focusMessageId, displayMessages]);

  const handleScrollPositionChange = ({ y }: { x: number; y: number }) => {
    if (y > 60) return;
    if (!hasNextPage || isFetchingNextPage) return;
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
        {displayMessages.map(({ message, sender, showHeader }) => (
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
            <PublicMessageItem
              message={message}
              sender={sender}
              showHeader={showHeader}
              tags={message.tagIds
                .map((id) => tagsById.get(id))
                .filter((t): t is PublicTag => t != null)}
            />
          </Box>
        ))}
      </Stack>
    </ScrollArea>
  );
}
