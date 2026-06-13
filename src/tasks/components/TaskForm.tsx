import {
  Divider,
  Group,
  Input,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import type { UseFormReturnType } from "@mantine/form";
import {
  IconAlignLeft,
  IconCalendarEvent,
  IconForms,
  IconListDetails,
  IconProgressCheck,
  IconTag,
} from "@tabler/icons-react";
import { useState } from "react";

import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "@/tasks/models/task";
import type { TaskFormValues } from "@/tasks/models/taskForm";

export type TaskFormMode = "create" | "edit";

interface Props {
  form: UseFormReturnType<TaskFormValues>;
  mode: TaskFormMode;
  // Batched tasks get tags/dueDate from the batch (sending them is a 400).
  batched?: boolean;
}

const STATUS_OPTIONS = TASK_STATUS_ORDER.map((status) => ({
  value: status,
  label: TASK_STATUS_LABELS[status],
}));

export function TaskForm({ form, mode, batched = false }: Props) {
  // Mirror custom-controlled fields into local state so they re-render on
  // change (uncontrolled Mantine form doesn't re-render on setFieldValue).
  const [tagIds, setTagIds] = useState<string[]>(form.getValues().tagIds);
  form.watch("tagIds", ({ value }) => setTagIds(value));

  // Details (status/due/tags) only render in edit mode or for standalone tasks.
  const showDetails = mode === "edit" || !batched;

  return (
    <Stack gap="sm">
      <TextInput
        label="Title"
        withAsterisk
        leftSection={<IconForms size={16} />}
        key={form.key("title")}
        {...form.getInputProps("title")}
      />
      <Textarea
        label="Description"
        autosize
        minRows={2}
        leftSection={<IconAlignLeft size={16} />}
        key={form.key("description")}
        {...form.getInputProps("description")}
      />

      {showDetails && (
        <>
          <Divider
            my={4}
            labelPosition="left"
            label={
              <Group gap={4} component="span">
                <IconListDetails size={14} />
                Details
              </Group>
            }
          />
          <Group grow align="flex-start">
            {mode === "edit" && (
              <Select
                label="Status"
                data={STATUS_OPTIONS}
                allowDeselect={false}
                leftSection={<IconProgressCheck size={16} />}
                key={form.key("status")}
                {...form.getInputProps("status")}
              />
            )}
            {!batched && (
              <DateTimePicker
                label="Due date"
                clearable
                leftSection={<IconCalendarEvent size={16} />}
                key={form.key("dueDate")}
                {...form.getInputProps("dueDate")}
              />
            )}
          </Group>
          {!batched && (
            <Input.Wrapper
              label={
                <Group gap={4} component="span">
                  <IconTag size={14} />
                  Tags
                </Group>
              }
            >
              <UserTagPicker
                selectedTagIds={tagIds}
                onChange={(value) => form.setFieldValue("tagIds", value)}
              />
            </Input.Wrapper>
          )}
        </>
      )}
    </Stack>
  );
}
