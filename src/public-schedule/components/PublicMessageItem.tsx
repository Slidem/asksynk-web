import { Badge, Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import DOMPurify from "dompurify";

import { UserBadge } from "@/components/UserBadge";
import { isoStringToFullDate, isoStringToTime } from "@/lib/date";
import type { Message } from "@/messages/models/message";
import classes from "@/public-schedule/components/PublicMessageList.module.css";
import type { PublicTag } from "@/public-schedule/models/publicTag";

export interface MessageSender {
  name: string | null;
  image: string | null;
}

interface Props {
  message: Message;
  sender: MessageSender;
  showHeader: boolean;
  tags: PublicTag[];
}

const AVATAR_SIZE = 36;

export function PublicMessageItem({
  message,
  sender,
  showHeader,
  tags,
}: Props) {
  const sanitized = DOMPurify.sanitize(message.body);
  const displayName = sender.name || "User";

  return (
    <Group gap="sm" align="flex-start" wrap="nowrap" mt={showHeader ? 6 : 0}>
      <Box w={AVATAR_SIZE} style={{ flexShrink: 0 }}>
        {showHeader ? (
          <UserBadge
            variant="avatar"
            size={AVATAR_SIZE}
            name={sender.name}
            image={sender.image}
          />
        ) : (
          <Tooltip
            label={isoStringToFullDate(message.createdAt)}
            position="left"
            withArrow
          >
            <Text size="xs" c="dimmed" ta="right">
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
            <Text size="xs" c="dimmed">
              {isoStringToTime(message.createdAt)}
            </Text>
          </Group>
        )}
        {tags.length > 0 && (
          <Group gap={4} mb={2} wrap="wrap">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                size="sm"
                variant="light"
                styles={{
                  root: { backgroundColor: tag.color, color: "#fff" },
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </Group>
        )}
        {message.body && (
          <Box
            className={classes.body}
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        )}
      </Stack>
    </Group>
  );
}
