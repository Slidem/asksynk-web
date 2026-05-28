import { Accordion, Badge, Group, SimpleGrid, Text } from "@mantine/core";

import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import {
  URGENCY_COLORS,
  URGENCY_ICONS,
  URGENCY_LABELS,
  type AttentionUrgency,
} from "@/attentionItems/models/urgency";

import { AttentionItemCard } from "./AttentionItemCard";

interface Props {
  urgency: AttentionUrgency;
  items: AttentionItemDto[];
}

export function AttentionItemsBucket({ urgency, items }: Props) {
  const Icon = URGENCY_ICONS[urgency];
  const color = URGENCY_COLORS[urgency];

  return (
    <Accordion.Item value={urgency}>
      <Accordion.Control>
        <Group gap="xs">
          <Icon size={16} color={`var(--mantine-color-${color}-6)`} />
          <Text fw={700} size="sm" tt="uppercase" c={color}>
            {URGENCY_LABELS[urgency]}
          </Text>
          <Badge size="sm" variant="light" color={color}>
            {items.length}
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {items.map((item) => (
            <AttentionItemCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
