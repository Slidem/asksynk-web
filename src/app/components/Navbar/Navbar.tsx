import { Center, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { IconDashboard } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";

import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import { SidebarTimer } from "@/timer/components/SidebarTimer";
import { UserProfile } from "@/app/components/Navbar/UserProfile";
import { navItems } from "@/app/components/Navbar/navItems";
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
