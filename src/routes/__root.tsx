import "@mantine/core/styles.css";
import "@/App.css";

import { Center, Loader, MantineProvider } from "@mantine/core";
import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import theme from "@/theme";
import { useSession } from "@/auth";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { isPending } = useSession();

  return (
    <MantineProvider theme={theme}>
      {isPending ? (
        <Center h="100vh">
          <Loader />
        </Center>
      ) : (
        <Outlet />
      )}
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </MantineProvider>
  );
}
