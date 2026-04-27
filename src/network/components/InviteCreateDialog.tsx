import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreateInvite } from "@/network/hooks/mutations/useCreateInvite";
import {
  useInviteDialogHandlers,
  useIsInviteDialogOpened,
} from "@/network/hooks/dialogs/inviteDialogHooks";

interface InviteFormValues {
  email: string;
}

const DEFAULT_VALUES: InviteFormValues = { email: "" };

export function InviteCreateDialog() {
  const opened = useIsInviteDialogOpened();
  const { close } = useInviteDialogHandlers();
  const { sendInvite, isSending } = useCreateInvite();

  const form = useForm<InviteFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_VALUES,
    validate: {
      email: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? null
          : "Enter a valid email",
    },
  });

  const handleClose = () => {
    form.reset();
    close();
  };

  const handleSubmit = (values: InviteFormValues) => {
    sendInvite(
      { email: values.email.trim().toLowerCase() },
      { onSuccess: handleClose },
    );
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Invite to your network" size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="person@example.com"
            type="email"
            required
            {...form.getInputProps("email")}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSending}>
              Send invite
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
