import { Badge, Group, SimpleGrid, Stack, Text } from "@mantine/core";

import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import {
  URGENCY_COLORS,
  URGENCY_LABELS,
  type AttentionUrgency,
} from "@/attentionItems/models/urgency";

import { AttentionItemCard } from "./AttentionItemCard";

interface Props {
  urgency: AttentionUrgency;
  items: AttentionItemDto[];
}

export function AttentionItemsBucket({ urgency, items }: Props) {
  return (
    <Stack gap="sm">
      <Group gap="xs">
        <Text fw={700} size="sm" tt="uppercase" c={URGENCY_COLORS[urgency]}>
          {URGENCY_LABELS[urgency]}
        </Text>
        <Badge size="sm" variant="light" color={URGENCY_COLORS[urgency]}>
          {items.length}
        </Badge>
      </Group>
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
        {items.map((item) => (
          <AttentionItemCard key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
