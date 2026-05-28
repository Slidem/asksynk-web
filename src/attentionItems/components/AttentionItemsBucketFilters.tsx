import { Chip, Group } from "@mantine/core";

import { useAttentionItemsByUrgency } from "@/attentionItems/hooks/useAttentionItemsByUrgency";
import {
  useSetVisibleAttentionBuckets,
  useVisibleAttentionBuckets,
} from "@/attentionItems/hooks/filters";
import {
  URGENCY_COLORS,
  URGENCY_ICONS,
  URGENCY_LABELS,
  URGENCY_ORDER,
  type AttentionUrgency,
} from "@/attentionItems/models/urgency";

export function AttentionItemsBucketFilters() {
  const visible = useVisibleAttentionBuckets();
  const setVisible = useSetVisibleAttentionBuckets();
  const { grouped } = useAttentionItemsByUrgency();

  return (
    <Chip.Group
      multiple
      value={visible}
      onChange={(value) => setVisible(value as AttentionUrgency[])}
    >
      <Group gap="xs" wrap="wrap">
        {URGENCY_ORDER.map((urgency) => {
          const Icon = URGENCY_ICONS[urgency];
          const count = grouped[urgency].length;
          return (
            <Chip
              key={urgency}
              value={urgency}
              color={URGENCY_COLORS[urgency]}
              variant="light"
              size="md"
              radius="xl"
              icon={<Icon size={14} />}
            >
              <Group gap={6} wrap="nowrap" component="span">
                <span>{URGENCY_LABELS[urgency]}</span>
                <span style={{ opacity: 0.55, fontVariantNumeric: "tabular-nums" }}>
                  {count}
                </span>
              </Group>
            </Chip>
          );
        })}
      </Group>
    </Chip.Group>
  );
}
