import {
  ColorInput,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconBolt, IconClock } from "@tabler/icons-react";

import type { TagFormValues } from "@/tags/models/tagForm";
import type { UseFormReturnType } from "@mantine/form";

interface TagFormProps {
  form: UseFormReturnType<TagFormValues>;
}

export function TagForm({ form }: TagFormProps) {
  const answerMode = form.getValues().answerMode;

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
      <Group grow>
        <Switch
          label="Browser notifications"
          key={form.key("browserNotificationEnabled")}
          {...form.getInputProps("browserNotificationEnabled", {
            type: "checkbox",
          })}
        />
        <Switch
          label="Sound alerts"
          key={form.key("soundNotificationEnabled")}
          {...form.getInputProps("soundNotificationEnabled", {
            type: "checkbox",
          })}
        />
      </Group>
    </Stack>
  );
}
