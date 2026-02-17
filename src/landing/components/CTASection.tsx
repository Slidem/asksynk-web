import {
  Button,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";

import { useSession } from "@/auth";

export function CTASection() {
  const { data: session } = useSession();

  return (
    <Container size="lg" py="xl" id="about">
      <Stack
        align="center"
        gap="lg"
        ta="center"
        p="xl"
        style={{
          background: "linear-gradient(135deg, var(--mantine-color-Remoraid-6), var(--mantine-color-Remoraid-8))",
          borderRadius: "var(--mantine-radius-lg)",
        }}
      >
        <Stack gap="xs">
          <Title order={2} c="white">
            Start Your Focus Journey
          </Title>
          <Text c="white" opacity={0.9} maw={400}>
            Join thousands who've reclaimed their attention. Build a schedule
            that works for you, not against you.
          </Text>
        </Stack>
        <Button
          component={Link}
          to={session ? "/dashboard" : "/signup"}
          size="lg"
          variant="white"
          c="Remoraid.8"
        >
          {session ? "Go to Dashboard" : "Get Started Free"}
        </Button>
      </Stack>
    </Container>
  );
}
