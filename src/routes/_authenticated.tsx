import { Container, Group, Stack, Title } from "@mantine/core";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AuthStatusBadge } from "@/components/AuthStatusBadge";
import { enforceLogin } from "@/oidc";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async (ctx) => {
    try {
      await enforceLogin(ctx);
    } catch {
      throw redirect({ to: "/signin" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <Container py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>asksynk</Title>
          <AuthStatusBadge />
        </Group>
        <Outlet />
      </Stack>
    </Container>
  );
}
