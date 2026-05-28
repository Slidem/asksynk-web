import { ActionIcon, Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import DOMPurify from "dompurify";

import type { TaggedMessageMetadata } from "@/attentionItems/models/attentionItem";
import { useTaggedMessageSender } from "@/attentionItems/hooks/useTaggedMessageSender";
import { UserBadge } from "@/components/UserBadge";

import classes from "./TaggedMessageBody.module.css";

interface Props {
  metadata: TaggedMessageMetadata;
}

export function TaggedMessageBody({ metadata }: Props) {
  const sender = useTaggedMessageSender(metadata);
  const sanitized = DOMPurify.sanitize(metadata.content);
  const displayName = sender.name || sender.email || "User";

  return (
    <Stack gap="xs">
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
          <UserBadge
            variant="avatar"
            size={20}
            name={sender.name}
            email={sender.email}
            image={sender.image}
          />
          <Text size="xs" fw={500} truncate>
            {displayName}
          </Text>
        </Group>
        <Tooltip label="Open in thread" withArrow>
          <ActionIcon
            component={Link}
            to="/messages/$threadId"
            params={{ threadId: metadata.threadId }}
            search={{ focusMessageId: metadata.messageId }}
            variant="subtle"
            size="sm"
            aria-label="Open in thread"
          >
            <IconArrowUpRight size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Box
        className={classes.body}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </Stack>
  );
}
