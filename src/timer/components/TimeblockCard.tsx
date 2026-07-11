import {
  Box,
  Card,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconClock, IconInfoCircle } from "@tabler/icons-react";

import { AttentionItemTagChips } from "@/attentionItems/components/AttentionItemTagChips";
import { useNow } from "@/lib/useNow";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import {
  blockProgress,
  formatBlockRange,
  formatTimeLeft,
} from "@/timer/utils/formatTimeblock";

const TICK_MS = 30_000;

interface Props {
  block: CalendarEvent;
}

export function TimeblockCard({ block }: Props) {
  const now = useNow(TICK_MS);
  const color = block.color ?? "blue";
  const progress = blockProgress(block.start, block.end, now) * 100;

  return (
    <Card withBorder radius="lg" padding="lg">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <ThemeIcon variant="light" color={color} radius="md" size={38}>
              <IconClock size={20} />
            </ThemeIcon>
            <Stack gap={2} style={{ minWidth: 0 }}>
              <Text
                tt="uppercase"
                size="xs"
                fw={700}
                c="dimmed"
                style={{ letterSpacing: "0.06em" }}
              >
                Current timeblock
              </Text>
              <Text fw={600} size="md" lineClamp={1}>
                {block.title}
              </Text>
            </Stack>
          </Group>

          <Tooltip
            multiline
            w={250}
            label="The block you're in right now. Your “Now” items are the ones tagged to it — handle them before this block ends."
          >
            <Box
              component="span"
              style={{
                display: "inline-flex",
                cursor: "help",
                color: "var(--mantine-color-dimmed)",
              }}
            >
              <IconInfoCircle size={16} />
            </Box>
          </Tooltip>
        </Group>

        <Group gap="xs" justify="space-between" wrap="nowrap">
          <Text size="sm" c="dimmed">
            {formatBlockRange(block.start, block.end)}
          </Text>
          <Text size="sm" fw={600} c={color}>
            {formatTimeLeft(block.end, now)}
          </Text>
        </Group>

        {block.tagIds && block.tagIds.length > 0 && (
          <AttentionItemTagChips tagIds={block.tagIds} />
        )}

        <Progress value={progress} color={color} size="sm" radius="xl" />
      </Stack>
    </Card>
  );
}
