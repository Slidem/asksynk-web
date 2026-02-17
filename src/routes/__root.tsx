import "@mantine/core/styles.css";

import { Center, Loader, MantineProvider } from "@mantine/core";
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
  const { isPending } = useSession();

  return (
    <MantineProvider
      defaultColorScheme="auto"
      theme={theme}
      colorSchemeManager={colorSchemeManager}
    >
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
