import { Container, Group, Stack, Text, Title } from "@mantine/core";

function App() {
  return (
    <Container py="xl">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={1}>asksynk</Title>
          <Text c="dimmed">web client</Text>
        </Group>
        <Text>
          React + Vite + Mantine ready. Start building your UI in
          <Text component="span" fw={600}>
            {" "}
            src/App.tsx
          </Text>
          .
        </Text>
      </Stack>
    </Container>
  );
}

export default App;
