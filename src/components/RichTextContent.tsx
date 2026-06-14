import { Box, Text } from "@mantine/core";
import DOMPurify from "dompurify";

import { isBlankHtml } from "@/lib/isBlankHtml";

interface Props {
  html: string;
  emptyLabel?: string;
}

// Read-only render of rich-text (tiptap) HTML, sanitized. Mirrors the tag
// description readonly view.
export function RichTextContent({ html, emptyLabel = "No description" }: Props) {
  if (isBlankHtml(html)) {
    return (
      <Text size="sm" c="dimmed" fs="italic">
        {emptyLabel}
      </Text>
    );
  }

  return (
    <Box
      c="dimmed"
      fz="sm"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
}
