import "@mantine/core/styles.css";

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
    <MantineProvider defaultColorScheme="light" theme={theme}>
      {isPending ? (
        <Center h="100vh" w="100vw">
          <Loader />
        </Center>
      ) : (
        <Outlet />
      )}
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </MantineProvider>
  );
}
