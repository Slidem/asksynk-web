import {
  Badge,
  Button,
  Group,
  Input,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconAlignLeft,
  IconArrowUpRight,
  IconCalendarEvent,
  IconListCheck,
  IconStack2,
  IconTag,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { DescriptionEditor } from "@/components/DescriptionEditor";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { CollapsibleSection } from "@/tasks/components/CollapsibleSection";
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
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const buildInput = () => {
    const values: BatchFormValues = {
      title,
      description,
      dueDate,
      tagIds,
      tasks: validChildren,
    };
    return batchFormValuesToCreateInput(values);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    createTaskBatch(buildInput());
    handleClose();
  };

  const handleSubmitAndOpen = () => {
    if (!canSubmit) return;
    createTaskBatch(buildInput(), {
      onSuccess: (batch) =>
        navigate({ to: "/batch/$batchId", params: { batchId: batch.id } }),
    });
    handleClose();
  };

  const cancelButton = (
    <Button variant="default" onClick={handleClose} fullWidth={isMobile}>
      Cancel
    </Button>
  );

  const createAndOpenButton = (
    <Button
      variant="light"
      leftSection={<IconArrowUpRight size={16} />}
      loading={isCreating}
      disabled={!canSubmit}
      onClick={handleSubmitAndOpen}
      fullWidth={isMobile}
    >
      Create & open
    </Button>
  );

  const submitButton = (
    <Button
      loading={isCreating}
      disabled={!canSubmit}
      onClick={handleSubmit}
      fullWidth={isMobile}
    >
      Create batch
    </Button>
  );

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title="Create batch"
      size="lg"
      fullScreen={isMobile}
    >
      <Stack gap="sm">
        <TextInput
          label="Batch title"
          withAsterisk
          leftSection={<IconStack2 size={16} />}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />

        <CollapsibleSection icon={<IconAlignLeft size={14} />} title="Description">
          <DescriptionEditor content={description} onChange={setDescription} />
        </CollapsibleSection>

        <CollapsibleSection
          icon={<IconCalendarEvent size={14} />}
          title="Due date & tags"
        >
          <Stack gap="sm">
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
          </Stack>
        </CollapsibleSection>

        <CollapsibleSection
          icon={<IconListCheck size={14} />}
          title="Tasks"
          action={
            <Badge size="sm" variant="light" color="gray">
              {children.length}
            </Badge>
          }
        >
          <TaskChildrenEditor items={children} onChange={setChildren} hideHeader />
        </CollapsibleSection>

        {isMobile ? (
          <Stack gap="xs" mt="sm">
            {submitButton}
            {createAndOpenButton}
            {cancelButton}
          </Stack>
        ) : (
          <Group justify="flex-end" mt="sm">
            {cancelButton}
            {createAndOpenButton}
            {submitButton}
          </Group>
        )}
      </Stack>
    </Modal>
  );
}
