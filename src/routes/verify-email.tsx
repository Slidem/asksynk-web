import { Alert, Card, Container, Stack, Text, Title } from "@mantine/core";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/auth";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, string | undefined>) => ({
    redirect: search.redirect,
  }),

  beforeLoad: async (ctx) => {
    const { data } = await authClient.getSession();
    if (!data) {
      throw redirect({
        to: "/signin",
        search: { redirect: ctx.location.pathname },
      });
    }
    if (data.user?.emailVerified) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <Stack gap="xs" align="center">
          <Title order={2}>Verify your email</Title>
          <Text size="sm" c="dimmed">
            You need to verify your email before continuing.
          </Text>
        </Stack>

        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Alert color="yellow" variant="light">
              Check your inbox for a verification link. Once verified, return to
              the app.
            </Alert>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
