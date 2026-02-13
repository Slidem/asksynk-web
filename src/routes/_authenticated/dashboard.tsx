import { Card, Stack, Text, Title } from "@mantine/core";

import { createFileRoute } from "@tanstack/react-router";
import { useOidc } from "@/oidc";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const oidc = useOidc({ assert: "user logged in" });

  return (
    <Stack gap="md">
      <Title order={2}>Dashboard</Title>

      <Card>
        <Stack gap="sm">
          <Text fw={500}>Welcome back!</Text>
          <Text c="dimmed" size="sm">
            You are signed in as{" "}
            <Text component="span" fw={500}>
              {oidc.decodedIdToken.email ||
                oidc.decodedIdToken.preferred_username ||
                oidc.decodedIdToken.name ||
                "User"}
            </Text>
          </Text>
        </Stack>
      </Card>

      <Card>
        <Stack gap="sm">
          <Text fw={500}>Your Profile</Text>
          <Stack gap="xs">
            {oidc.decodedIdToken.name && (
              <Text size="sm">
                <Text component="span" c="dimmed">
                  Name:
                </Text>{" "}
                {oidc.decodedIdToken.name}
              </Text>
            )}
            {oidc.decodedIdToken.email && (
              <Text size="sm">
                <Text component="span" c="dimmed">
                  Email:
                </Text>{" "}
                {oidc.decodedIdToken.email}
              </Text>
            )}
            {oidc.decodedIdToken.preferred_username && (
              <Text size="sm">
                <Text component="span" c="dimmed">
                  Username:
                </Text>{" "}
                {oidc.decodedIdToken.preferred_username}
              </Text>
            )}
            <Text size="sm">
              <Text component="span" c="dimmed">
                User ID:
              </Text>{" "}
              {oidc.decodedIdToken.sub}
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
