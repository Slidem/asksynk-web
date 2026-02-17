import { Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <Stack gap="md">
      <Title order={2}>Schedule</Title>
    </Stack>
  );
}
