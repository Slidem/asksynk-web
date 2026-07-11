import {
  Badge,
  Box,
  Collapse,
  Group,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconInfoCircle } from "@tabler/icons-react";

import { AttentionItemCard } from "@/attentionItems/components/AttentionItemCard";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import {
  URGENCY_COLORS,
  URGENCY_ICONS,
  URGENCY_LABELS,
} from "@/attentionItems/models/urgency";

interface Props {
  items: AttentionItemDto[];
}

export function FocusOverduePanel({ items }: Props) {
  const [opened, { toggle }] = useDisclosure(false);

  if (items.length === 0) return null;

  const Icon = URGENCY_ICONS.overdue;
  const color = URGENCY_COLORS.overdue;

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <UnstyledButton onClick={toggle}>
          <Group gap="xs">
            <IconChevronRight
              size={16}
              color={`var(--mantine-color-${color}-6)`}
              style={{
                transform: opened ? "rotate(90deg)" : "none",
                transition: "transform 150ms ease",
              }}
            />
            <Icon size={16} color={`var(--mantine-color-${color}-6)`} />
            <Text fw={700} size="sm" tt="uppercase" c={color}>
              {URGENCY_LABELS.overdue}
            </Text>
            <Badge size="sm" variant="light" color={color}>
              {items.length}
            </Badge>
          </Group>
        </UnstyledButton>
        <Tooltip
          multiline
          w={250}
          label="Past their due time and no longer in an active block. Tucked away so they don't distract — expand when you're ready to catch up."
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

      <Collapse in={opened}>
        <Stack gap="sm">
          {items.map((item) => (
            <AttentionItemCard key={item.id} item={item} />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}
