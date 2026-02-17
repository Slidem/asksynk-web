import { Container, Stack, Text, Title } from "@mantine/core";

import MagicLink from "./MagicLink";
import SignInCreateAccountCTA from "./SignInCreateAccountCTA";
import UserPass from "./UserPass";
import { useState } from "react";

/**
 * Container component for the SignIn page.
 */
const SignIn = () => {
  const [mode, setMode] = useState<"password" | "magic">("password");
  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <Stack gap="xs" align="center">
          <Title order={2}>Welcome back</Title>
          <Text size="sm" c="dimmed">
            Sign in to continue to asksynk.
          </Text>
        </Stack>

        {mode === "magic" ? (
          <MagicLink setMode={setMode} />
        ) : (
          <UserPass setMode={setMode} />
        )}
        <SignInCreateAccountCTA />
      </Stack>
    </Container>
  );
};

export default SignIn;
