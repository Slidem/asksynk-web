import {
  Anchor,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AuthStatusBadge } from "@/components/AuthStatusBadge";
import { useOidc } from "@/oidc";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const oidc = useOidc();

  return (
    <Container py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>asksynk</Title>
          <Group gap="sm">
            <AuthStatusBadge />
            {!oidc.isUserLoggedIn && (
              <>
                <Button
                  component={Link}
                  to="/signin"
                  variant="subtle"
                  size="sm"
                >
                  Sign In
                </Button>
                <Button component={Link} to="/signup" size="sm">
                  Sign Up
                </Button>
              </>
            )}
            {oidc.isUserLoggedIn && (
              <Button component={Link} to="/dashboard" size="sm">
                Dashboard
              </Button>
            )}
          </Group>
        </Group>

        <Stack gap="md">
          <Text size="lg">
            Welcome to asksynk. A modern web application with secure
            authentication.
          </Text>

          {!oidc.isUserLoggedIn && (
            <Text c="dimmed">
              <Anchor component={Link} to="/signin">
                Sign in
              </Anchor>{" "}
              or{" "}
              <Anchor component={Link} to="/signup">
                create an account
              </Anchor>{" "}
              to access your dashboard.
            </Text>
          )}

          {oidc.isUserLoggedIn && (
            <Text c="dimmed">
              You're signed in. Go to your{" "}
              <Anchor component={Link} to="/dashboard">
                dashboard
              </Anchor>{" "}
              to get started.
            </Text>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
