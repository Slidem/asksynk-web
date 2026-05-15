import {
  Button,
  ColorSwatch,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconMessage } from "@tabler/icons-react";

import { htmlToPreview } from "@/lib/htmlToPreview";
import { useStartTaggedThread } from "@/messages/hooks/useStartTaggedThread";
import { useUserAvailabilityDialogHandlers } from "@/network/hooks/dialogs/userAvailabilityDialogHooks";
import { TagAvailabilityHint } from "@/tags/components/TagAvailabilityHint";
import type { TagDto } from "@/tags/models/tag";

interface Props {
  tag: TagDto;
  userId: string;
}

const TOOLTIP =
  "If addressing a question based on this tag, this is the approximate answer time";

export function UserTagAvailabilityCard({ tag, userId }: Props) {
  const { start, isStarting } = useStartTaggedThread();
  const { close } = useUserAvailabilityDialogHandlers();

  const handleStart = async () => {
    await start(userId, [tag.id]);
    close();
  };

  return (
    <Paper withBorder radius="md" p="sm">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <ColorSwatch color={tag.color} size={14} />
            <Stack gap={0} style={{ minWidth: 0 }}>
              <Text size="sm" fw={600} truncate>
                {tag.name}
              </Text>
              {tag.description && (
                <Text size="xs" c="dimmed" truncate>
                  {htmlToPreview(tag.description)}
                </Text>
              )}
            </Stack>
          </Group>
          <Tooltip label={TOOLTIP} withArrow multiline w={220}>
            <span style={{ display: "inline-flex" }}>
              <TagAvailabilityHint tag={tag} userId={userId} />
            </span>
          </Tooltip>
        </Group>
        <Group justify="flex-end">
          <Button
            size="xs"
            variant="light"
            leftSection={<IconMessage size={14} />}
            onClick={handleStart}
            loading={isStarting}
          >
            Start a thread
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
