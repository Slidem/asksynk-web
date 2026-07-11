import {
  Badge,
  Box,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import { AttentionItemCard } from "@/attentionItems/components/AttentionItemCard";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import {
  URGENCY_COLORS,
  URGENCY_ICONS,
  URGENCY_LABELS,
} from "@/attentionItems/models/urgency";

interface Props {
  items: AttentionItemDto[];
  isLoading: boolean;
}

export function FocusNowList({ items, isLoading }: Props) {
  const Icon = URGENCY_ICONS.now;
  const color = URGENCY_COLORS.now;

  return (
    <Stack gap="sm">
      <Stack gap={2}>
        <Group gap="xs">
          <Icon size={18} color={`var(--mantine-color-${color}-6)`} />
          <Text fw={700} size="sm" tt="uppercase" c={color}>
            {URGENCY_LABELS.now}
          </Text>
          <Badge size="sm" variant="light" color={color}>
            {items.length}
          </Badge>
          <Tooltip
            multiline
            w={250}
            label="Items scheduled for the timeblock you're in. This is what to answer while focusing — nothing else competes for your attention here."
          >
            <Box
              component="span"
              style={{
                display: "inline-flex",
                cursor: "help",
                color: "var(--mantine-color-dimmed)",
              }}
            >
              <IconInfoCircle size={15} />
            </Box>
          </Tooltip>
        </Group>
        <Text size="xs" c="dimmed">
          Handle these during your current block.
        </Text>
      </Stack>

      {isLoading ? (
        <Center py="md">
          <Loader size="sm" />
        </Center>
      ) : items.length === 0 ? (
        <Text size="sm" c="dimmed">
          You're all caught up — nothing to answer right now.
        </Text>
      ) : (
        <Stack gap="sm">
          {items.map((item) => (
            <AttentionItemCard key={item.id} item={item} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
