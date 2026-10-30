import { Text } from "@mantine/core";

import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { htmlToPreview } from "@/lib/htmlToPreview";

interface Props {
  item: AttentionItemDto;
}

export function UnknownTypeBody({ item }: Props) {
  if (!item.preview.body) return null;

  return (
    <Text size="sm" c="dimmed" lineClamp={3}>
      {htmlToPreview(item.preview.body, 280)}
    </Text>
  );
}
