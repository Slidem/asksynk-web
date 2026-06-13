import { Center, Menu, Stack, Text, Tooltip, UnstyledButton } from "@mantine/core";
import {
  IconCalendar,
  IconChecklist,
  IconClock,
  IconDashboard,
  IconMessage,
  IconNetwork,
  IconPlugConnected,
  IconSettings,
  IconShare,
  IconTags,
} from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { authClient, useSession } from "@/auth";

import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import { UserBadge } from "@/components/UserBadge";
import { useProfile } from "@/profile/hooks/queries/useProfile";
import { SidebarTimer } from "@/timer/components/SidebarTimer";
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
  { icon: IconChecklist, label: "Tasks", to: "/tasks" },
  { icon: IconTags, label: "Tags", to: "/tags" },
  { icon: IconPlugConnected, label: "Integrations", to: "/integrations" },
  { icon: IconMessage, label: "Messages", to: "/messages" },
  { icon: IconNetwork, label: "Network", to: "/network" },
  { icon: IconShare, label: "Public Views", to: "/public-views" },
];

function UserProfile() {
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

      <SidebarTimer />
    </nav>
  );
}
