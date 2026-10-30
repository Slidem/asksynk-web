import { ActionIcon, Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import DOMPurify from "dompurify";

import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { useTaggedMessageSender } from "@/attentionItems/hooks/useTaggedMessageSender";
import { UserBadge } from "@/components/UserBadge";

import classes from "./TaggedMessageBody.module.css";

interface Props {
  item: AttentionItemDto;
}

export function TaggedMessageBody({ item }: Props) {
  const { threadId } = item.preview.meta;
  const sender = useTaggedMessageSender(item.preview.actor, threadId);
  const sanitized = DOMPurify.sanitize(item.preview.body ?? "");
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
            variant="subtle"
            size="sm"
            aria-label="Open in thread"
            renderRoot={(props) => (
              <Link
                to="/messages/$threadId"
                params={{ threadId }}
                search={{ focusMessageId: item.source.id }}
                {...props}
              />
            )}
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
