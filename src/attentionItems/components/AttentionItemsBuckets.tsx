import { Accordion, Center, Loader, Text } from "@mantine/core";
import { useState } from "react";

import { useVisibleAttentionBuckets } from "@/attentionItems/hooks/filters";
import { useAttentionItemsByUrgency } from "@/attentionItems/hooks/useAttentionItemsByUrgency";
import { URGENCY_ORDER } from "@/attentionItems/models/urgency";

import { AttentionItemsBucket } from "./AttentionItemsBucket";

export function AttentionItemsBuckets() {
  const { grouped, order, isLoading, isError } = useAttentionItemsByUrgency();
  const visibleBuckets = useVisibleAttentionBuckets();
  const [opened, setOpened] = useState<string[]>(() => [...URGENCY_ORDER]);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return <Text c="red">Failed to load attention items.</Text>;
  }

  const visible = order.filter(
    (u) => visibleBuckets.includes(u) && grouped[u].length > 0,
  );
  if (visible.length === 0) {
    return <Text c="dimmed">No attention items.</Text>;
  }

  return (
    <Accordion multiple value={opened} onChange={setOpened} variant="separated">
      {visible.map((urgency) => (
        <AttentionItemsBucket
          key={urgency}
          urgency={urgency}
          items={grouped[urgency]}
        />
      ))}
    </Accordion>
  );
}
