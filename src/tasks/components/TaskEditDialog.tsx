import { Button, Group, Modal, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { TaskForm } from "@/tasks/components/TaskForm";
import {
  useEditTaskDialogHandlers,
  useIsEditTaskDialogOpened,
  useOnSelectedEditedTaskChange,
  useOpenedEditTask,
} from "@/tasks/hooks/dialogs/editTaskDialogHooks";
import { useDeleteTask } from "@/tasks/hooks/mutations/useDeleteTask";
import { useUpdateTask } from "@/tasks/hooks/mutations/useUpdateTask";
import {
  DEFAULT_TASK_FORM_VALUES,
  type TaskFormValues,
} from "@/tasks/models/taskForm";
import { taskDtoToFormValues, taskFormValuesToUpdateInput } from "@/tasks/utils/taskFormMapper";
import { validateTaskTitle } from "@/tasks/utils/validateTaskTitle";

export function TaskEditDialog() {
  const isOpened = useIsEditTaskDialogOpened();
  const selectedTask = useOpenedEditTask();
  const { close: closeDialog } = useEditTaskDialogHandlers();
  const { updateTask, isUpdating } = useUpdateTask();
  const { deleteTask, isDeleting } = useDeleteTask();
  const isMobile = useIsMobile();

  const form = useForm<TaskFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TASK_FORM_VALUES,
    validate: {
      title: validateTaskTitle,
    },
    validateInputOnBlur: true,
  });

  useOnSelectedEditedTaskChange((task) => {
    if (task) {
      form.setValues(taskDtoToFormValues(task));
    }
  });

  const handleClose = () => {
    form.reset();
    closeDialog();
  };

  const handleSave = () => {
    if (!selectedTask) return;

    const { hasErrors } = form.validate();
    if (hasErrors) return;
    updateTask(taskFormValuesToUpdateInput(form.getValues(), selectedTask.id));
    handleClose();
  };

  const handleDelete = () => {
    if (!selectedTask) return;
    deleteTask(selectedTask.id);
    handleClose();
  };

  const deleteButton = (
    <Button
      variant="subtle"
      color="red"
      loading={isDeleting}
      onClick={handleDelete}
      fullWidth={isMobile}
    >
      Delete
    </Button>
  );

  const openButton = selectedTask && (
    <Button
      variant="light"
      leftSection={<IconArrowUpRight size={16} />}
      fullWidth={isMobile}
      renderRoot={(props) => (
        <Link
          to="/task/$taskId"
          params={{ taskId: selectedTask.id }}
          onClick={handleClose}
          {...props}
        />
      )}
    >
      Open full page
    </Button>
  );

  const cancelButton = (
    <Button variant="default" onClick={handleClose} fullWidth={isMobile}>
      Cancel
    </Button>
  );

  const saveButton = (
    <Button loading={isUpdating} onClick={handleSave} fullWidth={isMobile}>
      Save
    </Button>
  );

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title="Task details"
      size="lg"
      fullScreen={isMobile}
    >
      {selectedTask && (
        <TaskForm
          form={form}
          mode="edit"
          batched={Boolean(selectedTask.batchId)}
        />
      )}

      {isMobile ? (
        <Stack gap="xs" mt="md">
          {saveButton}
          {cancelButton}
          <Group grow gap="xs">
            {deleteButton}
            {openButton}
          </Group>
        </Stack>
      ) : (
        <Group justify="space-between" mt="md">
          <Group gap="xs">
            {deleteButton}
            {openButton}
          </Group>
          <Group gap="xs">
            {cancelButton}
            {saveButton}
          </Group>
        </Group>
      )}
    </Modal>
  );
}
