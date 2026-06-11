import { Container, Stack } from "@mantine/core";

import { useHandleOAuthReturn } from "@/integrations/hooks/useHandleOAuthReturn";
import { AddIntegrationDialog } from "./AddIntegrationDialog";
import { IntegrationsGrid } from "./IntegrationsGrid";
import { IntegrationsPageHeader } from "./IntegrationsPageHeader";
import { ManageIntegrationDialog } from "./ManageIntegrationDialog";

export function IntegrationsPage() {
  useHandleOAuthReturn();

  return (
    <Container size="xl" maw={1200} w="100%" py="lg">
      <Stack gap="lg">
        <IntegrationsPageHeader />
        <IntegrationsGrid />
      </Stack>

      <AddIntegrationDialog />
      <ManageIntegrationDialog />
    </Container>
  );
}
