import { Avatar, Badge, Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { useOidc } from "@/oidc";

export function AuthStatusBadge() {
  const oidc = useOidc();

  if (!oidc.isUserLoggedIn) {
    return (
      <Badge variant="light" color="gray">
        Guest
      </Badge>
    );
  }

  const { decodedIdToken, logout } = oidc;
  const displayName =
    decodedIdToken.name ||
    decodedIdToken.preferred_username ||
    decodedIdToken.email ||
    "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
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
        {decodedIdToken.email && (
          <Menu.Item disabled>
            <Text size="xs" c="dimmed">
              {decodedIdToken.email}
            </Text>
          </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Item
          color="red"
          onClick={() => logout({ redirectTo: "specific url", url: "/" })}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
