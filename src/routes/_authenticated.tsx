import { Container, Group, Stack, Title } from "@mantine/core";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AuthStatusBadge } from "@/components/AuthStatusBadge";
import { authClient } from "@/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async (ctx) => {
    const { data } = await authClient.getSession();
    const rawSearch = ctx.location.search;
    const searchString =
      typeof rawSearch === "string"
        ? rawSearch
        : rawSearch && typeof rawSearch === "object"
          ? (() => {
              const params = new URLSearchParams();
              for (const [key, value] of Object.entries(rawSearch)) {
                if (value === undefined || value === null) {
                  continue;
                }
                params.append(key, String(value));
              }
              const built = params.toString();
              return built ? `?${built}` : "";
            })()
          : "";
    const normalizedSearch =
      searchString && !searchString.startsWith("?")
        ? `?${searchString}`
        : searchString;
    const redirectTarget = `${ctx.location.pathname}${normalizedSearch || ""}${ctx.location.hash || ""}`;
    if (!data) {
      throw redirect({
        to: "/signin",
        search: { redirect: redirectTarget },
      });
    }
    if (!data.user?.emailVerified) {
      throw redirect({
        to: "/verify-email",
        search: { redirect: redirectTarget },
      });
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
