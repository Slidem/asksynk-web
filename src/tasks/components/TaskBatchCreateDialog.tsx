import {
  Button,
  Group,
  Input,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconAlignLeft,
  IconCalendarEvent,
  IconStack2,
  IconTag,
} from "@tabler/icons-react";
import { useState } from "react";

import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { TaskChildrenEditor } from "@/tasks/components/TaskChildrenEditor";
import {
  useCreateTaskBatchDialogHandlers,
  useIsCreateTaskBatchDialogOpened,
} from "@/tasks/hooks/dialogs/createTaskBatchDialogHooks";
import { useCreateTaskBatch } from "@/tasks/hooks/mutations/useCreateTaskBatch";
import {
  makeEmptyTaskChild,
  type BatchFormValues,
  type TaskChildFormValues,
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
  const [children, setChildren] = useState<TaskChildFormValues[]>([
    makeEmptyTaskChild(),
  ]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setDueDate(null);
    setTagIds([]);
    setChildren([makeEmptyTaskChild()]);
  };

  const handleClose = () => {
    reset();
    close();
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
    <Modal opened={isOpened} onClose={handleClose} title="Create batch" size="lg">
      <Stack gap="sm">
        <TextInput
          label="Batch title"
          withAsterisk
          leftSection={<IconStack2 size={16} />}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <Textarea
          label="Description"
          autosize
          minRows={2}
          leftSection={<IconAlignLeft size={16} />}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
        <DateTimePicker
          label="Due date (whole batch)"
          clearable
          leftSection={<IconCalendarEvent size={16} />}
          value={dueDate}
          onChange={(value) => setDueDate(value ? new Date(value) : null)}
        />
        <Input.Wrapper
          label={
            <Group gap={4} component="span">
              <IconTag size={14} />
              Tags (applied to the whole batch)
            </Group>
          }
        >
          <UserTagPicker selectedTagIds={tagIds} onChange={setTagIds} />
        </Input.Wrapper>

        <TaskChildrenEditor items={children} onChange={setChildren} />

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
