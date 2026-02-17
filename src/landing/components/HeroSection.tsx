import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";

import { useSession } from "@/auth";

export function HeroSection() {
  const { data: session } = useSession();

  return (
    <Container size="lg" py="xl">
      <Stack align="center" gap="xl" ta="center">
        <Stack gap="md" maw={600}>
          <Title order={1} size="h1">
            Control Your Focus. Own Your Time.
          </Title>
          <Text size="lg" c="dimmed">
            The async productivity tool that puts you in charge. Tag your time
            blocks, route communications by priority, and build notification
            barriers that protect your flow.
          </Text>
        </Stack>

        <Group gap="md">
          {session ? (
            <Button
              component={Link}
              to="/dashboard"
              size="lg"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/signup"
                size="lg"
              >
                Get Started Free
              </Button>
              <Button
                component="a"
                href="#features"
                variant="light"
                size="lg"
              >
                Learn More
              </Button>
            </>
          )}
        </Group>
      </Stack>
    </Container>
  );
}
