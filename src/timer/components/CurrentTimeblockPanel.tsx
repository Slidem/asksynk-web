import { Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconCalendarOff } from "@tabler/icons-react";

import { useCurrentTimeblocks } from "@/attentionItems/hooks/useCurrentTimeblocks";

import { TimeblockCard } from "./TimeblockCard";

export function CurrentTimeblockPanel() {
  const blocks = useCurrentTimeblocks();

  if (blocks.length === 0) {
    return (
      <Card withBorder radius="lg" padding="lg" style={{ borderStyle: "dashed" }}>
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon variant="light" color="gray" radius="md" size={38}>
            <IconCalendarOff size={20} />
          </ThemeIcon>
          <Stack gap={2}>
            <Text fw={600} size="md">
              No active timeblock
            </Text>
            <Text size="sm" c="dimmed">
              Nothing is scheduled right now — enjoy the open focus time.
            </Text>
          </Stack>
        </Group>
      </Card>
    );
  }

  return (
    <Stack gap="sm">
      {blocks.map((block) => (
        <TimeblockCard key={block.id} block={block} />
      ))}
    </Stack>
  );
}
