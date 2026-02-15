import "@mantine/core/styles.css";
import "@/App.css";

import { Center, Loader, MantineProvider } from "@mantine/core";
import { OidcInitializationGate, bootstrapOidc, getOidcConfig } from "@/oidc";
import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import theme from "@/theme";

export const Route = createRootRoute({
  beforeLoad: async () => {
    await bootstrapOidc(getOidcConfig());
  },
  component: () => (
    <MantineProvider theme={theme}>
      <OidcInitializationGate
        fallback={
          <Center h="100vh">
            <Loader />
          </Center>
        }
      >
        <Outlet />
      </OidcInitializationGate>
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </MantineProvider>
  ),
});
