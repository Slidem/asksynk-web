import { Button, Group, Modal, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { TaskForm } from "@/tasks/components/TaskForm";
import {
  useCreateTaskDialogHandlers,
  useCreateTaskPresetBatchId,
  useIsCreateTaskDialogOpened,
} from "@/tasks/hooks/dialogs/createTaskDialogHooks";
import { useCreateTask } from "@/tasks/hooks/mutations/useCreateTask";
import {
  DEFAULT_TASK_FORM_VALUES,
  type TaskFormValues,
} from "@/tasks/models/taskForm";
import { taskFormValuesToCreateInput } from "@/tasks/utils/taskFormMapper";
import { validateTaskTitle } from "@/tasks/utils/validateTaskTitle";

export function TaskCreateDialog() {
  const { createTask, isCreating } = useCreateTask();
  const isOpened = useIsCreateTaskDialogOpened();
  const presetBatchId = useCreateTaskPresetBatchId();
  const { close: closeDialog } = useCreateTaskDialogHandlers();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const form = useForm<TaskFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TASK_FORM_VALUES,
    validate: {
      title: validateTaskTitle,
    },
    validateInputOnBlur: true,
  });

  const handleClose = () => {
    form.reset();
    closeDialog();
  };

  const buildInput = () => {
    const values = form.getValues();
    if (presetBatchId) {
      values.batchId = presetBatchId;
    }
    return taskFormValuesToCreateInput(values);
  };

  const handleCreate = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;
    createTask(buildInput());
    handleClose();
  };

  const handleCreateAndOpen = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;
    createTask(buildInput(), {
      onSuccess: (task) =>
        navigate({ to: "/task/$taskId", params: { taskId: task.id } }),
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
      onClick={handleCreateAndOpen}
      fullWidth={isMobile}
    >
      Create & open
    </Button>
  );

  const createButton = (
    <Button loading={isCreating} onClick={handleCreate} fullWidth={isMobile}>
      Create task
    </Button>
  );

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title={presetBatchId ? "Add task to batch" : "Create task"}
      size="lg"
      fullScreen={isMobile}
    >
      <TaskForm form={form} mode="create" batched={Boolean(presetBatchId)} />
      {isMobile ? (
        <Stack gap="xs" mt="md">
          {createButton}
          {createAndOpenButton}
          {cancelButton}
        </Stack>
      ) : (
        <Group justify="flex-end" mt="md">
          {cancelButton}
          {createAndOpenButton}
          {createButton}
        </Group>
      )}
    </Modal>
  );
}
