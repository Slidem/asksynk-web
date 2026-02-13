import "@mantine/core/styles.css";
import "@/App.css";

import { Outlet, createRootRoute } from "@tanstack/react-router";

import { MantineProvider } from "@mantine/core";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import theme from "@/theme";

export const Route = createRootRoute({
  component: () => (
    <MantineProvider theme={theme}>
      <Outlet />
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </MantineProvider>
  ),
});
