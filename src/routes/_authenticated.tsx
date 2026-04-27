import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { Box } from "@mantine/core";
import { Navbar } from "@/app/components/Navbar/Navbar";
import { authClient } from "@/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data } = await authClient.getSession();
    if (!data) {
      throw redirect({
        to: "/signin",
        search: { redirect: location.href, verified: undefined },
      });
    }
    if (!data.user?.emailVerified) {
      throw redirect({
        to: "/verify-email",
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <Box style={{ display: "flex" }}>
      <Navbar />
      <Box
        component="main"
        style={{ flex: 1, padding: "var(--mantine-spacing-md)" }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
