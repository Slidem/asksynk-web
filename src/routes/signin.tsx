import { Center, Loader, Stack, Text } from "@mantine/core";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getOidc, useOidc } from "@/oidc";

import { useEffect } from "react";

export const Route = createFileRoute("/signin")({
  beforeLoad: async () => {
    const oidc = await getOidc();
    if (oidc.isUserLoggedIn) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: SignInPage,
});

function SignInPage() {
  const oidc = useOidc();

  useEffect(() => {
    if (!oidc.isUserLoggedIn) {
      void oidc.login();
    }
  }, [oidc]);

  return (
    <Center h="100vh">
      <Stack gap="xs" align="center">
        <Loader />
        <Text size="sm" c="dimmed">
          Redirecting to sign in...
        </Text>
      </Stack>
    </Center>
  );
}
