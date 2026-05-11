import { Center, Drawer, Loader, Stack, Text } from "@mantine/core";
import { useSession } from "@/auth";
import { MessageBubble } from "@/messages/components/MessageBubble";
import { MessageComposer } from "@/messages/components/MessageComposer";
import { ReplyList } from "@/messages/components/ReplyList";
import {
  useReplyPanelHandlers,
  useReplyPanelOpenMessageId,
} from "@/messages/hooks/dialogs/replyPanelHooks";
import { useThreadMessagesQuery } from "@/messages/hooks/queries/useThreadMessagesQuery";
import type { Message } from "@/messages/models/message";
import type { ThreadOtherParticipant } from "@/messages/models/thread";
import { useEffect, useMemo } from "react";

interface Props {
  threadId: string;
  other: ThreadOtherParticipant;
  recipientUserId: string | null;
  frozen?: boolean;
}

interface SenderInfo {
  name: string | null;
  email: string | null;
  image: string | null;
}

export function ReplyPanel({
  threadId,
  other,
  recipientUserId,
  frozen = false,
}: Props) {
  const openMessageId = useReplyPanelOpenMessageId();
  const { close } = useReplyPanelHandlers();
  const { data: session } = useSession();
  const { data } = useThreadMessagesQuery(threadId);

  useEffect(() => {
    return () => {
      close();
    };
  }, [threadId, close]);

  const parent = useMemo<Message | null>(() => {
    if (!openMessageId || !data) {
      return null;
    }
    for (const page of data.pages) {
      const found = page.find((m) => m.id === openMessageId);
      if (found) {
        return found;
      }
    }
    return null;
  }, [data, openMessageId]);

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

  const parentSender = useMemo<SenderInfo | null>(() => {
    if (!parent) {
      return null;
    }
    const isOwn =
      parent.senderKind === "user" &&
      parent.senderId === session?.user?.id;
    if (isOwn) {
      return {
        name: session?.user?.name ?? null,
        email: session?.user?.email ?? null,
        image: session?.user?.image ?? null,
      };
    }
    return otherSender;
  }, [
    parent,
    otherSender,
    session?.user?.id,
    session?.user?.name,
    session?.user?.email,
    session?.user?.image,
  ]);

  return (
    <Drawer
      opened={openMessageId !== null}
      onClose={close}
      position="right"
      size="md"
      title="Thread"
      padding="0"
      styles={{
        body: { padding: 0, height: "calc(100% - 60px)" },
        content: { display: "flex", flexDirection: "column" },
      }}
    >
      {openMessageId && parent && parentSender ? (
        <Stack gap={0} h="100%">
          <Stack
            gap={0}
            py="xs"
            style={{
              borderBottom: "1px solid var(--mantine-color-default-border)",
            }}
          >
            <MessageBubble
              message={parent}
              sender={parentSender}
              showHeader
              recipientUserId={recipientUserId}
              isReply
            />
          </Stack>
          <ReplyList
            threadId={threadId}
            messageId={openMessageId}
            other={other}
            recipientUserId={recipientUserId}
          />
          <MessageComposer
            threadId={threadId}
            parentMessageId={openMessageId}
            recipientUserId={recipientUserId}
            frozen={frozen}
          />
        </Stack>
      ) : openMessageId ? (
        <Center flex={1} h="100%">
          <Loader />
        </Center>
      ) : (
        <Center flex={1} h="100%">
          <Text c="dimmed">No thread open.</Text>
        </Center>
      )}
    </Drawer>
  );
}
