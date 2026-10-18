import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import theme from "@/theme";
import { useSession } from "@/auth";
import { cookieColorSchemeManager } from "@/lib/cookieColorSchemeManager";

const colorSchemeManager = cookieColorSchemeManager();

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  // Keep useSession() here to trigger the initial fetch and keep the session atom alive.
  // Auth-protected routes handle their own loading state.
  useSession();

  return (
    <MantineProvider
      defaultColorScheme="auto"
      theme={theme}
      colorSchemeManager={colorSchemeManager}
    >
      <ModalsProvider>
        <Notifications position="bottom-right" />
        <Outlet />
      </ModalsProvider>
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </MantineProvider>
  );
}
