import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";

import {
  useCreatePublicViewDialogHandlers,
  useIsCreatePublicViewDialogOpened,
} from "@/public-views/hooks/dialogs/createPublicViewDialogHooks";
import { useCreatePublicView } from "@/public-views/hooks/mutations/useCreatePublicView";

interface FormValues {
  name: string;
  expiresAt: string | null;
}

const DEFAULT_VALUES: FormValues = {
  name: "",
  expiresAt: null,
};

const MAX_EXPIRY_DAYS = 30;

export function PublicViewCreateDialog() {
  const opened = useIsCreatePublicViewDialogOpened();
  const { close } = useCreatePublicViewDialogHandlers();
  const { create, isCreating } = useCreatePublicView();

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_VALUES,
    validate: {
      expiresAt: (value) => {
        if (!value) {
          return null;
        }

        const expireDate = new Date(value);

        if (expireDate.getTime() <= Date.now()) {
          return "Must be in the future";
        }

        if (
          expireDate.getTime() >
          Date.now() + MAX_EXPIRY_DAYS * 24 * 60 * 60 * 1000
        ) {
          return `Max ${MAX_EXPIRY_DAYS} days from now`;
        }
        return null;
      },
    },
  });

  const handleClose = () => {
    form.reset();
    close();
  };

  const handleSubmit = (values: FormValues) => {
    create(
      {
        name: values.name.trim() || undefined,
        expiresAt: values.expiresAt
          ? new Date(values.expiresAt).toISOString()
          : undefined,
      },
      { onSuccess: handleClose },
    );
  };

  const maxDate = dayjs().add(MAX_EXPIRY_DAYS, "day").toDate();

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create public view"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="e.g. March availability"
            description="Optional. Helps you identify the link later."
            {...form.getInputProps("name")}
          />
          <DateTimePicker
            label="Expires at"
            placeholder="Defaults to 24h from now"
            description={`Optional. Max ${MAX_EXPIRY_DAYS} days.`}
            clearable
            minDate={new Date()}
            maxDate={maxDate}
            {...form.getInputProps("expiresAt")}
          />
          <Text size="xs" c="dimmed">
            You can revoke the link at any time.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating}>
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
