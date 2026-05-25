import { Text } from "@mantine/core";
import type { TaggedMessageMetadata } from "@/attentionItems/models/attentionItem";

interface Props {
  metadata: TaggedMessageMetadata;
}

export function TaggedMessageBody({ metadata }: Props) {
  return (
    <Text size="sm" c="dimmed" lineClamp={3}>
      {metadata.content}
    </Text>
  );
}
