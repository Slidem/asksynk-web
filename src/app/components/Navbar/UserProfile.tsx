import { Menu, Text, UnstyledButton } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { authClient, useSession } from "@/auth";
import { UserBadge } from "@/components/UserBadge";
import { useProfile } from "@/profile/hooks/queries/useProfile";
import classes from "@/app/components/Navbar/Navbar.module.css";

export function UserProfile() {
  const { data: session } = useSession();
  const { data: profile } = useProfile();

  if (!session) return null;

  return (
    <Menu shadow="md" width={200} position="right-end">
      <Menu.Target>
        <UnstyledButton className={classes.profileButton}>
          <UserBadge
            name={session.user?.name}
            email={session.user?.email}
            image={profile?.image ?? session.user?.image}
            variant="avatar"
            size="md"
          />
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
        <Menu.Item
          component={Link}
          to="/settings"
          leftSection={<IconSettings size={16} />}
        >
          Profile & settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          onClick={async () => {
            await authClient.signOut();
            window.location.href = "/";
          }}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
