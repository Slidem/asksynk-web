import { Stack, Title } from "@mantine/core";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/timer")({
  component: TimerPage,
});

function TimerPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Timer</Title>
    </Stack>
  );
}
