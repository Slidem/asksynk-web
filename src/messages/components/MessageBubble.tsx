import { Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import { UserBadge } from "@/components/UserBadge";
import type { Message } from "@/messages/models/message";
import DOMPurify from "dompurify";
import { isoStringToFullDate, isoStringToTime } from "@/lib/date";
import classes from "@/messages/components/MessageBubble.module.css";

interface SenderInfo {
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Props {
  message: Message;
  sender: SenderInfo;
  showHeader: boolean;
}

const AVATAR_SIZE = 36;

export function MessageBubble({ message, sender, showHeader }: Props) {
  const sanitized = DOMPurify.sanitize(message.body);
  const displayName = sender.name || sender.email || "User";

  return (
    <Group
      gap="sm"
      align="flex-start"
      wrap="nowrap"
      className={`${classes.row} ${showHeader ? "" : classes.rowFollowup}`}
      mt={showHeader ? 6 : 0}
    >
      <Box w={AVATAR_SIZE} style={{ flexShrink: 0 }}>
        {showHeader ? (
          <UserBadge
            variant="avatar"
            size={AVATAR_SIZE}
            name={sender.name}
            email={sender.email}
            image={sender.image}
          />
        ) : (
          <Tooltip
            label={isoStringToFullDate(message.createdAt)}
            position="left"
            withArrow
          >
            <Text
              size="xs"
              c="dimmed"
              ta="right"
              className={classes.hoverTime}
            >
              {isoStringToTime(message.createdAt)}
            </Text>
          </Tooltip>
        )}
      </Box>
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        {showHeader && (
          <Group gap={8} align="baseline">
            <Text fw={700} size="sm">
              {displayName}
            </Text>
            <Tooltip
              label={isoStringToFullDate(message.createdAt)}
              position="top"
              withArrow
            >
              <Text size="xs" c="dimmed">
                {isoStringToTime(message.createdAt)}
              </Text>
            </Tooltip>
          </Group>
        )}
        <Box
          className={classes.body}
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      </Stack>
    </Group>
  );
}
