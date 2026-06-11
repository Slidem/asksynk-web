import { Center, Loader, SimpleGrid, Text } from "@mantine/core";

import { useCalendarIntegrations } from "@/integrations/hooks/queries/useCalendarIntegrations";
import { AddIntegrationCard } from "./AddIntegrationCard";
import { IntegrationCard } from "./IntegrationCard";

export function IntegrationsGrid() {
  const { data: integrations, isLoading, isError } = useCalendarIntegrations();

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return <Text c="red">Failed to load integrations.</Text>;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {integrations?.map((integration) => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
      <AddIntegrationCard />
    </SimpleGrid>
  );
}
