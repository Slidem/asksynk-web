import {
  Box,
  Burger,
  Divider,
  Drawer,
  Group,
  NavLink,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "@tanstack/react-router";

import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import { SidebarTimer } from "@/timer/components/SidebarTimer";
import { UserProfile } from "@/app/components/Navbar/UserProfile";
import { navItems } from "@/app/components/Navbar/navItems";

// Mobile-only (hidden from `sm`): a top bar with a burger + brand that opens a
// left Drawer holding the same nav as the desktop rail, with labels.
export function MobileNav() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();

  return (
    <>
      <Group
        hiddenFrom="sm"
        justify="space-between"
        wrap="nowrap"
        mb="md"
        pb="xs"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group gap="sm" wrap="nowrap">
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            aria-label="Toggle navigation"
          />
          <Text fw={700} size="lg">
            asksynk
          </Text>
        </Group>
        <ColorSchemeToggle />
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        size="75%"
        title="asksynk"
        hiddenFrom="sm"
      >
        <Stack gap="xs">
          <Group justify="space-between">
            <UserProfile />
            <SidebarTimer />
          </Group>

          <Divider />

          <Box>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                component={Link}
                to={item.to}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={location.pathname === item.to}
                onClick={close}
              />
            ))}
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}
