import { Flex, Group, Input, Select, Stack, TextInput } from "@mantine/core";
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

import { DescriptionEditor } from "@/components/DescriptionEditor";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { CollapsibleSection } from "@/tasks/components/CollapsibleSection";
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
  const [description, setDescription] = useState<string>(
    form.getValues().description,
  );
  form.watch("description", ({ value }) => setDescription(value));

  // Details (status/due/tags) only render in edit mode or for standalone tasks.
  const showDetails = mode === "edit" || !batched;

  return (
    <Stack gap="sm">
      <TextInput
        placeholder="Task title"
        leftSection={<IconForms size={16} />}
        key={form.key("title")}
        {...form.getInputProps("title")}
      />

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

      <CollapsibleSection icon={<IconAlignLeft size={14} />} title="Description">
        <DescriptionEditor
          content={description}
          onChange={(html) => form.setFieldValue("description", html)}
        />
      </CollapsibleSection>

      {showDetails && (
        <CollapsibleSection
          icon={<IconListDetails size={14} />}
          title="Due date & Status"
        >
          <Flex
            direction={{ base: "column", xs: "row" }}
            gap="sm"
            align="flex-start"
          >
            {!batched && (
              <DateTimePicker
                label="Due date"
                clearable
                leftSection={<IconCalendarEvent size={16} />}
                style={{ flex: 1 }}
                w="100%"
                key={form.key("dueDate")}
                {...form.getInputProps("dueDate")}
              />
            )}
            {mode === "edit" && (
              <Select
                label="Status"
                data={STATUS_OPTIONS}
                allowDeselect={false}
                leftSection={<IconProgressCheck size={16} />}
                style={{ flex: 1 }}
                w="100%"
                key={form.key("status")}
                {...form.getInputProps("status")}
              />
            )}
          </Flex>
        </CollapsibleSection>
      )}
    </Stack>
  );
}
