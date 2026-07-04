import {
  ActionIcon,
  Anchor,
  Box,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconMessageCircle,
  IconTag,
} from "@tabler/icons-react";
import { useState } from "react";
import { UserBadge } from "@/components/UserBadge";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { Message } from "@/messages/models/message";
import DOMPurify from "dompurify";
import { isoStringToFullDate, isoStringToTime } from "@/lib/date";
import classes from "@/messages/components/MessageBubble.module.css";
import { MessageAttentionStatusControl } from "@/messages/components/MessageAttentionStatusControl";
import { MessageTaskSuggestionCard } from "@/messages/components/MessageTaskSuggestionCard";
import { TagChipsRow } from "@/messages/components/TagChipsRow";
import { TagPickerDialog } from "@/tags/components/TagPickerDialog";
import { useTagMessage } from "@/messages/hooks/useTagMessage";
import { useSession } from "@/auth";

interface SenderInfo {
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Props {
  message: Message;
  sender: SenderInfo;
  showHeader: boolean;
  /** null for guest threads; disables tag actions/lookups. */
  recipientUserId: string | null;
  /** The viewer's tagged_message attention item for this message, if they own one. */
  attentionItem?: AttentionItemDto;
  isReply?: boolean;
  onReply?: () => void;
  onShowReplies?: () => void;
}

const AVATAR_SIZE = 36;

export function MessageBubble({
  message,
  sender,
  showHeader,
  recipientUserId,
  attentionItem,
  isReply = false,
  onReply,
  onShowReplies,
}: Props) {
  const { data: session } = useSession();
  const { tagMessage } = useTagMessage(message.threadId);
  const [pickerOpen, setPickerOpen] = useState(false);

  const sanitized = DOMPurify.sanitize(message.body);
  const displayName = sender.name || sender.email || "User";
  const isOwn = session?.user?.id === message.senderId;
  const isTagged = (message.tagIds?.length ?? 0) > 0;
  const canTag = !isReply && isOwn && recipientUserId != null;
  const showReplyControls = !isReply;
  const replyCount = message.replyCount;
  const canShowMenu = canTag || (showReplyControls && !!onReply);

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
            <Text size="xs" c="dimmed" ta="right" className={classes.hoverTime}>
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
        <Box className={isTagged ? classes.tagged : undefined}>
          {(isTagged || attentionItem) && (
            <Group gap="xs" align="center" mb={4} wrap="wrap">
              {isTagged && (
                <TagChipsRow
                  tagIds={message.tagIds}
                  userId={isOwn ? (recipientUserId ?? undefined) : undefined}
                />
              )}
              {attentionItem && (
                <MessageAttentionStatusControl item={attentionItem} />
              )}
            </Group>
          )}
          {message.body && (
            <Box
              className={classes.body}
              dangerouslySetInnerHTML={{ __html: sanitized }}
            />
          )}
        </Box>
        {message.suggestionId && (
          <MessageTaskSuggestionCard suggestionId={message.suggestionId} />
        )}
        {showReplyControls && replyCount > 0 && onShowReplies && (
          <Anchor
            component="button"
            type="button"
            size="xs"
            fw={600}
            onClick={onShowReplies}
            style={{ alignSelf: "flex-start" }}
          >
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </Anchor>
        )}
      </Stack>
      {canShowMenu && (
        <Box className={classes.kebab} style={{ flexShrink: 0 }}>
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                size="sm"
                aria-label="Message actions"
              >
                <IconDotsVertical size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {showReplyControls && onReply && (
                <Menu.Item
                  leftSection={<IconMessageCircle size={14} />}
                  onClick={onReply}
                >
                  Reply
                </Menu.Item>
              )}
              {canTag && (
                <Menu.Item
                  leftSection={<IconTag size={14} />}
                  onClick={() => setPickerOpen(true)}
                >
                  {isTagged ? "Edit tags" : "Tag message"}
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Box>
      )}
      {canTag && (
        <TagPickerDialog
          opened={pickerOpen}
          initialTagIds={message.tagIds ?? []}
          targetUserId={recipientUserId ?? undefined}
          title={isTagged ? "Edit tags" : "Tag message"}
          confirmLabel="Save"
          onConfirm={(tagIds) => tagMessage(message.id, tagIds)}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </Group>
  );
}
