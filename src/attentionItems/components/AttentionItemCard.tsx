import { Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";

import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";

import { AttentionItemDueDate } from "./AttentionItemDueDate";
import { AttentionItemStatusBadge } from "./AttentionItemStatusBadge";
import { AttentionItemStatusMenu } from "./AttentionItemStatusMenu";
import { AttentionItemTagChips } from "./AttentionItemTagChips";
import { getAttentionItemConfig } from "./attentionItemTypeRegistry";

interface Props {
  item: AttentionItemDto;
}

export function AttentionItemCard({ item }: Props) {
  const { Icon, Body, getDisplayTitle } = getAttentionItemConfig(
    item.metadata.type,
  );
  const title = getDisplayTitle(item.metadata);

  return (
    <Card radius="lg" shadow="sm" padding="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <ThemeIcon variant="light" radius="xl" size={28}>
              <Icon size={16} />
            </ThemeIcon>
            <Text fw={600} size="sm" lineClamp={2}>
              {title}
            </Text>
          </Group>
          <AttentionItemStatusMenu item={item} />
        </Group>

        <Body item={item} metadata={item.metadata} />

        {item.note && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            v{item.note}
          </Text>
        )}

        <Group gap="xs" wrap="wrap" justify="space-between">
          <Group gap="xs" wrap="wrap">
            <AttentionItemStatusBadge status={item.status} />
            <AttentionItemDueDate dueDate={item.dueDate} />
          </Group>
          <AttentionItemTagChips tagIds={item.tagIds} />
        </Group>
      </Stack>
    </Card>
  );
}
