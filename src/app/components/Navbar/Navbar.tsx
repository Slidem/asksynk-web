import {
  Avatar,
  Center,
  Menu,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconDashboard,
  IconMessage,
  IconNetwork,
  IconPlugConnected,
  IconTags,
} from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { authClient, useSession } from "@/auth";

import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import classes from "./Navbar.module.css";

interface NavbarLinkProps {
  icon: typeof IconDashboard;
  label: string;
  to: string;
  active?: boolean;
}

function NavbarLink({ icon: Icon, label, to, active }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        component={Link}
        to={to}
        className={classes.link}
        data-active={active || undefined}
        aria-label={label}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const navItems = [
  { icon: IconDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: IconCalendar, label: "Schedule", to: "/schedule" },
  { icon: IconClock, label: "Timer", to: "/timer" },
  { icon: IconTags, label: "Tags", to: "/tags" },
  { icon: IconPlugConnected, label: "Integrations", to: "/integrations" },
  { icon: IconMessage, label: "Messages", to: "/messages" },
  { icon: IconNetwork, label: "Network", to: "/network" },
];

function UserProfile() {
  const { data: session } = useSession();

  if (!session) return null;

  const displayName = session.user?.name || session.user?.email || "User";
  const initials = displayName
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Menu shadow="md" width={200} position="right-end">
      <Menu.Target>
        <UnstyledButton className={classes.profileButton}>
          <Tooltip
            label={displayName}
            position="right"
            transitionProps={{ duration: 0 }}
          >
            <Avatar size="md" radius="xl" color="blue">
              {initials}
            </Avatar>
          </Tooltip>
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
            window.location.href = "/";
          }}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function Navbar() {
  const location = useLocation();

  const links = navItems.map((item) => (
    <NavbarLink
      {...item}
      key={item.label}
      active={location.pathname === item.to}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <UserProfile />
      </Center>

      <Center mt="lg">
        <Tooltip
          label="Toggle theme"
          position="right"
          transitionProps={{ duration: 0 }}
        >
          <div className={classes.themeToggle}>
            <ColorSchemeToggle />
          </div>
        </Tooltip>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}
