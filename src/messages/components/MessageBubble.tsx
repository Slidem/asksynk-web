import { Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import { UserBadge } from "@/components/UserBadge";
import type { Message } from "@/messages/models/message";
import type { ThreadOtherParticipant } from "@/messages/models/thread";
import DOMPurify from "dompurify";
import { isoStringToFullDate, isoStringToTime } from "@/lib/date";

interface Props {
  message: Message;
  isOwn: boolean;
  other: ThreadOtherParticipant;
}

export function MessageBubble({ message, isOwn, other }: Props) {
  const sanitized = DOMPurify.sanitize(message.body);

  const otherDisplayName =
    other.kind === "user" ? other.name || other.email : other.displayName;

  const otherImage = other.kind === "user" ? other.image : null;

  const otherEmail = other.kind === "user" ? other.email : null;

  return (
    <Group
      gap="xs"
      align="flex-end"
      justify={isOwn ? "flex-end" : "flex-start"}
      wrap="nowrap"
    >
      {!isOwn && (
        <UserBadge
          variant="avatar"
          size="sm"
          name={otherDisplayName}
          email={otherEmail}
          image={otherImage}
        />
      )}
      <Stack gap={2} maw="75%" align={isOwn ? "flex-end" : "flex-start"}>
        <Tooltip
          label={isoStringToFullDate(message.createdAt)}
          position="top"
          withArrow
        >
          <Box
            px="sm"
            py={6}
            style={{
              borderRadius: 12,
              backgroundColor: isOwn
                ? "var(--mantine-color-blue-6)"
                : "var(--mantine-color-default-hover)",
              color: isOwn ? "white" : undefined,
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        </Tooltip>
        <Text size="xs" c="dimmed">
          {isoStringToTime(message.createdAt)}
        </Text>
      </Stack>
    </Group>
  );
}
