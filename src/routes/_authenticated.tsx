import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { Box } from "@mantine/core";
import { Navbar } from "@/app/components/Navbar/Navbar";
import { MobileNav } from "@/app/components/Navbar/MobileNav";
import { authClient } from "@/auth";
import { useAppSocketConnection } from "@/app/hooks/useAppSocketConnection";
import { AttentionItemsEngine } from "@/attentionItems/components/AttentionItemsEngine";
import { TimerEngine } from "@/timer/components/TimerEngine";
import { FloatingTimer } from "@/timer/components/FloatingTimer";
import { TimerSettingsDialog } from "@/timer/components/TimerSettingsDialog";

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
  useAppSocketConnection();

  return (
    <Box style={{ display: "flex" }}>
      <Box visibleFrom="sm">
        <Navbar />
      </Box>
      <Box
        component="main"
        style={{ flex: 1, minWidth: 0, padding: "var(--mantine-spacing-md)" }}
      >
        <MobileNav />
        <Outlet />
      </Box>
      <TimerEngine />
      <AttentionItemsEngine />
      <FloatingTimer />
      <TimerSettingsDialog />
    </Box>
  );
}
