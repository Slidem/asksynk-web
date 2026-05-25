import { Center, Loader, Stack, Text } from "@mantine/core";

import { useAttentionItemsByUrgency } from "@/attentionItems/hooks/useAttentionItemsByUrgency";

import { AttentionItemsBucket } from "./AttentionItemsBucket";

export function AttentionItemsBuckets() {
  const { grouped, order, isLoading, isError } = useAttentionItemsByUrgency();

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

  const visible = order.filter((u) => grouped[u].length > 0);
  if (visible.length === 0) {
    return <Text c="dimmed">No attention items.</Text>;
  }

  return (
    <Stack gap="xl">
      {visible.map((urgency) => (
        <AttentionItemsBucket
          key={urgency}
          urgency={urgency}
          items={grouped[urgency]}
        />
      ))}
    </Stack>
  );
}
