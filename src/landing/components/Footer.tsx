import { Container, Group, Text } from "@mantine/core";

export function Footer() {
  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" c="dimmed">
        <Text size="sm">
          asksynk
        </Text>
        <Text size="sm">
          {new Date().getFullYear()} asksynk. All rights reserved.
        </Text>
      </Group>
    </Container>
  );
}
