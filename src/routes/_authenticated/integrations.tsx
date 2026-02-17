import { Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/integrations")({
  component: IntegrationsPage,
});

function IntegrationsPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Integrations</Title>
    </Stack>
  );
}
