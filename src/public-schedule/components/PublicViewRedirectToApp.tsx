import { Button, Container, Group, Paper, Stack, Text } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  isYourView: boolean;
  isAConnectionView: boolean;
  onStayOnPublicView: () => void;
}

export const PublicViewRedirectToApp: React.FC<Props> = ({
  isYourView,
  isAConnectionView,
  onStayOnPublicView,
}) => {
  const navigate = useNavigate();

  const text = isYourView
    ? "This is your own schedule. You can view and manage it in the app."
    : isAConnectionView
      ? "This schedule belongs to one of your connections. You can view it directly in the app."
      : "";

  if (!isAConnectionView && !isYourView) {
    return null;
  }

  return (
    <Container size="xs" py="xl">
      <Paper p="xl" radius="lg" shadow="sm" withBorder>
        <Stack gap="md">
          <Text size="md" c="dimmed">
            {text}
          </Text>
          <Group grow>
            <Button variant="outline" onClick={onStayOnPublicView}>
              Continue in public view
            </Button>
            <Button
              onClick={() =>
                navigate({ to: "/schedule", search: { userId: undefined } })
              }
            >
              Go to app
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};
