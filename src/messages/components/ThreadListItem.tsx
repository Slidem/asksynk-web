import { Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { Link, useParams } from "@tanstack/react-router";
import { UserBadge } from "@/components/UserBadge";
import { htmlToPreview } from "@/messages/utils/htmlToPreview";
import type { ThreadListItem as ThreadListItemModel } from "@/messages/models/thread";
import { formatIsoStringToRelativeDate } from "@/lib/date";

interface Props {
  thread: ThreadListItemModel;
}

export function ThreadListItem({ thread }: Props) {
  const params = useParams({ strict: false });
  const isActive = params.threadId === thread.threadId;

  const { other, lastMessage } = thread;
  const name =
    other.kind === "user" ? other.name || other.email : other.displayName;
  const email = other.kind === "user" ? other.email : null;
  const image = other.kind === "user" ? other.image : null;

  const preview = lastMessage
    ? htmlToPreview(lastMessage.body)
    : "No messages yet";

  return (
    <UnstyledButton
      renderRoot={(props) => (
        <Link
          to="/messages/$threadId"
          params={{ threadId: thread.threadId }}
          {...props}
        />
      )}
      w="100%"
    >
      <Box
        p="sm"
        style={{
          borderRadius: 8,
          backgroundColor: isActive
            ? "var(--mantine-color-default-hover)"
            : undefined,
        }}
      >
        <Group
          justify="space-between"
          align="flex-start"
          wrap="nowrap"
          gap="sm"
        >
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
            <UserBadge
              variant="avatar"
              size="md"
              name={name}
              email={email}
              image={image}
            />
            <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
              <Text fw={500} size="sm" truncate>
                {name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {preview}
              </Text>
            </Stack>
          </Group>
          {lastMessage && (
            <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
              {formatIsoStringToRelativeDate(lastMessage.createdAt)}
            </Text>
          )}
        </Group>
      </Box>
    </UnstyledButton>
  );
}
