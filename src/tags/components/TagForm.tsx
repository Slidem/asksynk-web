import {
  ColorInput,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconBell, IconBolt, IconClock, IconVolume } from "@tabler/icons-react";

import type { TagFormValues } from "@/tags/models/tagForm";
import type { UseFormReturnType } from "@mantine/form";
import { useState } from "react";

interface TagFormProps {
  form: UseFormReturnType<TagFormValues>;
}

export function TagForm({ form }: TagFormProps) {
  const [answerMode, setAnswerMode] = useState(form.getValues().answerMode);

  form.watch("answerMode", ({ value }) => setAnswerMode(value));

  return (
    <Stack gap="sm">
      <TextInput
        label="Name"
        placeholder="Focus time"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <Textarea
        label="Description"
        placeholder="What does this tag represent?"
        minRows={3}
        key={form.key("description")}
        {...form.getInputProps("description")}
      />
      <Group grow>
        <ColorInput
          label="Color"
          key={form.key("color")}
          {...form.getInputProps("color")}
        />
        <Select
          label="Answer mode"
          leftSection={
            answerMode === "immediately" ? (
              <IconBolt size={16} />
            ) : (
              <IconClock size={16} />
            )
          }
          key={form.key("answerMode")}
          {...form.getInputProps("answerMode")}
          data={[
            { value: "timeblock", label: "Timeblock" },
            { value: "immediately", label: "Immediately" },
          ]}
        />
      </Group>
      {answerMode === "immediately" && (
        <Group grow>
          <NumberInput
            label="Response time"
            min={1}
            key={form.key("responseValue")}
            {...form.getInputProps("responseValue")}
          />
          <Select
            label="Unit"
            key={form.key("responseUnit")}
            {...form.getInputProps("responseUnit")}
            data={[
              { value: "minutes", label: "Minutes" },
              { value: "hours", label: "Hours" },
            ]}
          />
        </Group>
      )}
      <Text size="sm" fw={500}>
        Notifications
      </Text>
      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="sm" align="center">
              <IconBell size={18} color="var(--mantine-color-dimmed)" />
              <div>
                <Text size="sm">Browser notifications</Text>
                <Text size="xs" c="dimmed">
                  Get notified in your browser
                </Text>
              </div>
            </Group>
            <Switch
              key={form.key("browserNotificationEnabled")}
              {...form.getInputProps("browserNotificationEnabled", {
                type: "checkbox",
              })}
            />
          </Group>
          <Group justify="space-between" align="center">
            <Group gap="sm" align="center">
              <IconVolume size={18} color="var(--mantine-color-dimmed)" />
              <div>
                <Text size="sm">Sound alerts</Text>
                <Text size="xs" c="dimmed">
                  Play a sound on new messages
                </Text>
              </div>
            </Group>
            <Switch
              key={form.key("soundNotificationEnabled")}
              {...form.getInputProps("soundNotificationEnabled", {
                type: "checkbox",
              })}
            />
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
