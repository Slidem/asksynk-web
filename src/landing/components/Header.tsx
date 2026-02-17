import { Box, Button, Container, Group, Text } from "@mantine/core";

import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import { Link } from "@tanstack/react-router";
import { useSession } from "@/auth";

export function Header() {
  const { data: session } = useSession();

  return (
    <Box
      component="header"
      pos="sticky"
      top={0}
      style={{ zIndex: 100, backdropFilter: "blur(8px)" }}
      bg="var(--mantine-color-body)"
      bd="0 0 1px 0 var(--mantine-color-default-border)"
    >
      <Container size="lg" h={60}>
        <Group justify="space-between" h="100%">
          <Text
            component={Link}
            to="/"
            fw={700}
            size="xl"
            c="Remoraid"
            style={{ textDecoration: "none" }}
          >
            asksynk
          </Text>

          <Group gap="sm">
            <Button component="a" href="#features" variant="subtle" size="sm">
              Features
            </Button>
            <Button component="a" href="#about" variant="subtle" size="sm">
              About
            </Button>
            <ColorSchemeToggle />
            {!session && (
              <>
                <Button
                  component={Link}
                  to="/signin"
                  variant="subtle"
                  size="sm"
                >
                  Sign In
                </Button>
                <Button component={Link} to="/signup" size="sm">
                  Get Started
                </Button>
              </>
            )}
            {session && (
              <Button component={Link} to="/dashboard" size="sm">
                Dashboard
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
