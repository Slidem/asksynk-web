import {
  Avatar,
  Badge,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { authClient, useSession } from "@/auth";

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

  const displayName = session.user?.name || session.user?.email || "User";
  const initials = displayName
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs">
            <Avatar size="sm" radius="xl" color="green">
              {initials}
            </Avatar>
            <Text size="sm" fw={500}>
              {displayName}
            </Text>
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
