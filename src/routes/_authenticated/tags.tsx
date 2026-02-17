import { Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tags")({
  component: TagsPage,
});

function TagsPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Tags</Title>
    </Stack>
  );
}
