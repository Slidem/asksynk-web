import { Container, Stack, Text, Title } from "@mantine/core";

import SignUpMagicLink from "./SignUpMagicLink";
import SignUpSignInCTA from "./SignUpSignInCTA";
import SignUpUserPass from "./SignUpUserPass";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";

const SignUp = () => {
  const { redirect: redirectParam } = useSearch({
    from: "/signup",
  });

  const redirectTo = redirectParam?.startsWith("/")
    ? redirectParam
    : "/dashboard";

  const [mode, setMode] = useState<"password" | "magic">("password");

  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <Stack gap="xs" align="center">
          <Title order={2}>Create your account</Title>
          <Text size="sm" c="dimmed">
            Join asksynk and get started in minutes.
          </Text>
        </Stack>

        {mode === "magic" ? (
          <SignUpMagicLink redirectTo={redirectTo} setMode={setMode} />
        ) : (
          <SignUpUserPass redirectTo={redirectTo} setMode={setMode} />
        )}

        <SignUpSignInCTA redirectTo={redirectTo} />
      </Stack>
    </Container>
  );
};

export default SignUp;
