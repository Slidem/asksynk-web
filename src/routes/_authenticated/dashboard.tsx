import { Card, Stack, Text, Title } from "@mantine/core";

import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Stack gap="md">
      <Title order={2}>Dashboard</Title>

      <Card>
        <Stack gap="sm">
          <Text fw={500}>Welcome back!</Text>
          <Text c="dimmed" size="sm">
            You are signed in as{" "}
            <Text component="span" fw={500}>
              {user?.email || user?.name || "User"}
            </Text>
          </Text>
        </Stack>
      </Card>

      <Card>
        <Stack gap="sm">
          <Text fw={500}>Your Profile</Text>
          <Stack gap="xs">
            {user?.name && (
              <Text size="sm">
                <Text component="span" c="dimmed">
                  Name:
                </Text>{" "}
                {user.name}
              </Text>
            )}
            {user?.email && (
              <Text size="sm">
                <Text component="span" c="dimmed">
                  Email:
                </Text>{" "}
                {user.email}
              </Text>
            )}
            <Text size="sm">
              <Text component="span" c="dimmed">
                User ID:
              </Text>{" "}
              {user?.id ?? "-"}
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
