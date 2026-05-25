import { Text } from "@mantine/core";
import type { AttentionItemMetadata } from "@/attentionItems/models/attentionItem";

interface Props {
  metadata: AttentionItemMetadata;
}

export function UnknownTypeBody({ metadata }: Props) {
  return (
    <Text size="sm" c="dimmed" fs="italic">
      Preview unavailable for type "{metadata.type}".
    </Text>
  );
}
