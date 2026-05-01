import { Badge, Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { authClient, useSession } from "@/auth";

import { UserBadge } from "@/components/UserBadge";
import { useNavigate } from "@tanstack/react-router";

export function AuthStatusBadge() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    return (
      <Badge variant="light" color="gray">
        Guest
      </Badge>
    );
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs">
            <UserBadge
              name={session.user?.name}
              email={session.user?.email}
              variant="name"
              size="sm"
              color="green"
            />
            <Badge variant="light" color="green" size="xs">
              Authenticated
            </Badge>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        {session.user?.email && (
          <Menu.Item disabled>
            <Text size="xs" c="dimmed">
              {session.user.email}
            </Text>
          </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Item
          color="red"
          onClick={async () => {
            await authClient.signOut();
            navigate({ to: "/" });
          }}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
