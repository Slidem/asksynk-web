import { Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/network")({
  component: NetworkPage,
});

function NetworkPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Network</Title>
    </Stack>
  );
}
