import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
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
      <Outlet />
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </MantineProvider>
  );
}
