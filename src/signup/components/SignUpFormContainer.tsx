import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { memo } from "react";

interface Props {
  mode: "password" | "magic";
  setMode: (mode: "password" | "magic") => void;
  renderAlert: () => React.ReactNode | null;
  renderForm: () => React.ReactNode;
  submitLabel: string;
  isSubmitting: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const SignUpFormContainer = ({
  mode,
  setMode,
  renderAlert,
  renderForm,
  submitLabel,
  isSubmitting,
  handleSubmit,
}: Props) => {
  const isMagicMode = mode === "magic";

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={500}>Sign up</Text>
          <Group gap="xs">
            <Button
              size="xs"
              variant={isMagicMode ? "subtle" : "light"}
              onClick={() => setMode("password")}
              disabled={isSubmitting}
            >
              Password
            </Button>
            <Button
              size="xs"
              variant={isMagicMode ? "light" : "subtle"}
              onClick={() => setMode("magic")}
              disabled={isSubmitting}
            >
              Magic link
            </Button>
          </Group>
        </Group>

        {renderAlert()}

        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            {renderForm()}
            <Button type="submit" loading={isSubmitting} fullWidth>
              {submitLabel}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
};

export default memo(SignUpFormContainer);
