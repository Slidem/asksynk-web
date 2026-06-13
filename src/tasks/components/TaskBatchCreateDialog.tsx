import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Input,
  Modal,
  Paper,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { UserTagPicker } from "@/tags/components/UserTagPicker";
import {
  useCreateTaskBatchDialogHandlers,
  useIsCreateTaskBatchDialogOpened,
} from "@/tasks/hooks/dialogs/createTaskBatchDialogHooks";
import { useCreateTaskBatch } from "@/tasks/hooks/mutations/useCreateTaskBatch";
import {
  makeEmptyBatchChild,
  type BatchChildFormValues,
  type BatchFormValues,
} from "@/tasks/models/taskForm";
import { batchFormValuesToCreateInput } from "@/tasks/utils/batchFormMapper";

export function TaskBatchCreateDialog() {
  const isOpened = useIsCreateTaskBatchDialogOpened();
  const { close } = useCreateTaskBatchDialogHandlers();
  const { createTaskBatch, isCreating } = useCreateTaskBatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [children, setChildren] = useState<BatchChildFormValues[]>([
    makeEmptyBatchChild(),
  ]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setDueDate(null);
    setTagIds([]);
    setChildren([makeEmptyBatchChild()]);
  };

  const handleClose = () => {
    reset();
    close();
  };

  const updateChild = (
    index: number,
    patch: Partial<BatchChildFormValues>,
  ) => {
    setChildren((prev) =>
      prev.map((child, i) => (i === index ? { ...child, ...patch } : child)),
    );
  };

  const validChildren = children.filter((c) => c.title.trim().length > 0);
  const canSubmit = title.trim().length > 0 && validChildren.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const values: BatchFormValues = {
      title,
      description,
      dueDate,
      tagIds,
      tasks: validChildren,
    };
    createTaskBatch(batchFormValuesToCreateInput(values));
    handleClose();
  };

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title="Create batch"
      size="lg"
    >
      <Stack gap="sm">
        <TextInput
          label="Batch title"
          withAsterisk
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <Textarea
          label="Description"
          autosize
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
        <DateTimePicker
          label="Due date (whole batch)"
          clearable
          value={dueDate}
          onChange={(value) => setDueDate(value ? new Date(value) : null)}
        />
        <Input.Wrapper label="Tags (applied to the whole batch)">
          <UserTagPicker selectedTagIds={tagIds} onChange={setTagIds} />
        </Input.Wrapper>

        <Divider label="Tasks" labelPosition="left" />

        {children.map((child, index) => (
          <Paper key={index} withBorder radius="md" p="sm">
            <Stack gap="xs">
              <Group justify="space-between" wrap="nowrap">
                <TextInput
                  placeholder="Task title"
                  value={child.title}
                  onChange={(e) =>
                    updateChild(index, { title: e.currentTarget.value })
                  }
                  style={{ flex: 1 }}
                />
                <ActionIcon
                  variant="subtle"
                  color="red"
                  disabled={children.length === 1}
                  onClick={() =>
                    setChildren((prev) => prev.filter((_, i) => i !== index))
                  }
                  aria-label="Remove task"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
              <Textarea
                placeholder="Description (optional)"
                autosize
                minRows={1}
                value={child.description}
                onChange={(e) =>
                  updateChild(index, { description: e.currentTarget.value })
                }
              />
            </Stack>
          </Paper>
        ))}

        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconPlus size={14} />}
          onClick={() =>
            setChildren((prev) => [...prev, makeEmptyBatchChild()])
          }
        >
          Add task
        </Button>

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={isCreating}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Create batch
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
