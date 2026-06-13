import { Button, Group, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";

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

  const handleCreate = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    const values = form.getValues();
    if (presetBatchId) {
      values.batchId = presetBatchId;
    }
    createTask(taskFormValuesToCreateInput(values));
    handleClose();
  };

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title={presetBatchId ? "Add task to batch" : "Create task"}
      size="lg"
    >
      <TaskForm form={form} mode="create" batched={Boolean(presetBatchId)} />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handleClose}>
          Cancel
        </Button>
        <Button loading={isCreating} onClick={handleCreate}>
          Create task
        </Button>
      </Group>
    </Modal>
  );
}
