import { Box, Card, Group, Text } from "@mantine/core";
import DOMPurify from "dompurify";

import { AttentionItemStatusBadge } from "@/attentionItems/components/AttentionItemStatusBadge";
import { isoStringToFullDate } from "@/lib/date";
import { TagChipsRow } from "@/messages/components/TagChipsRow";
import type { Message } from "@/messages/models/message";

interface Props {
  message: Message;
  /** Owner of the tags (the public-view owner). */
  ownerUserId: string;
}

export function PublicTaggedMessageCard({ message, ownerUserId }: Props) {
  const sanitized = DOMPurify.sanitize(message.body);
  const status = message.managedStatus?.status;

  return (
    <Card withBorder radius="md" padding="sm">
      <Group justify="space-between" align="center" mb="xs" wrap="wrap" gap="xs">
        <TagChipsRow tagIds={message.tagIds} userId={ownerUserId} />
        {status && <AttentionItemStatusBadge status={status} radius="sm" />}
      </Group>
      {message.body && (
        <Box
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      )}
      <Text size="xs" c="dimmed" mt="xs">
        {isoStringToFullDate(message.createdAt)}
      </Text>
    </Card>
  );
}
