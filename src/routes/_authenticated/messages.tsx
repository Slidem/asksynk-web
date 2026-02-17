import { Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Messages</Title>
    </Stack>
  );
}
