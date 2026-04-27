import { Container, Stack } from "@mantine/core";

import { PublicViewCreateDialog } from "@/public-views/components/PublicViewCreateDialog";
import { PublicViewGuestsDialog } from "@/public-views/components/PublicViewGuestsDialog";
import { PublicViewsList } from "@/public-views/components/PublicViewsList";
import { PublicViewsPageHeader } from "@/public-views/components/PublicViewsPageHeader";

export function PublicViewsPage() {
  return (
    <Container size="xl" maw={1200} w="100%" py="lg">
      <Stack gap="lg">
        <PublicViewsPageHeader />
        <PublicViewsList />
      </Stack>

      <PublicViewCreateDialog />
      <PublicViewGuestsDialog />
    </Container>
  );
}
