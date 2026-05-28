import {
  Button,
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";

import type { PublicViewMetadataDto } from "@/public-schedule/models/publicView";
import { useSignInGuest } from "@/public-schedule/hooks/mutations/useSignInGuest";

interface FormValues {
  displayName: string;
}

interface Props {
  view: PublicViewMetadataDto;
}

export function PublicViewSignInForm({ view }: Props) {
  const { signIn, isSigningIn } = useSignInGuest();

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: { displayName: "" },
    validate: {
      displayName: (value) => {
        const trimmed = value.trim();

        if (trimmed.length === 0) {
          return "Required";
        }

        if (trimmed.length > 80) {
          return "Max 80 characters";
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: FormValues) => {
    signIn({ slug: view.slug, displayName: values.displayName.trim() });
  };

  return (
    <Container size="xs" py="xl">
      <Paper p="xl" radius="lg" shadow="sm" withBorder>
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={2}>{view.name ?? "Shared schedule"}</Title>
            <Text size="sm" c="dimmed">
              Enter a display name to view this schedule.
            </Text>
            <Text size="xs" c="dimmed">
              Link expires {dayjs(view.expiresAt).format("MMM D, YYYY HH:mm")}.
            </Text>
          </Stack>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Display name"
                placeholder="Your name"
                autoFocus
                required
                {...form.getInputProps("displayName")}
              />
              <Button type="submit" loading={isSigningIn} fullWidth>
                Continue
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
