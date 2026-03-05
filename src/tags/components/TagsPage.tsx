import { Container, Stack } from "@mantine/core";

import { TagCards } from "./TagCards";
import { TagCreateDialog } from "./TagCreateDialog";
import { TagEditDialog } from "./TagEditDialog";
import { TagsPageHeader } from "./TagsPageHeader";

export function TagsPage() {
  return (
    <Container size="xl" maw={1200} w="100%" py="lg">
      <Stack gap="lg">
        <TagsPageHeader />
        <TagCards />
      </Stack>

      <TagCreateDialog />
      <TagEditDialog />
    </Container>
  );
}
