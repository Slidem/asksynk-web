import { Alert, Card, Container, Stack, Text, Title } from "@mantine/core";
import { memo } from "react";

const VerifyEmail = () => {
  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <Stack gap="xs" align="center">
          <Title order={2}>Verify your email</Title>
          <Text size="sm" c="dimmed">
            You need to verify your email before continuing.
          </Text>
        </Stack>

        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Alert color="yellow" variant="light">
              Check your inbox for a verification link. Once verified, return to
              the app.
            </Alert>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default memo(VerifyEmail);
