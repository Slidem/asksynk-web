import { Button, Group, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";

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

  return (
    <Modal opened={isOpened} onClose={handleClose} title="Task details" size="lg">
      {selectedTask && (
        <TaskForm
          form={form}
          mode="edit"
          batched={Boolean(selectedTask.batchId)}
        />
      )}

      <Group justify="space-between" mt="md">
        <Button
          variant="subtle"
          color="red"
          loading={isDeleting}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Group gap="xs">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={isUpdating} onClick={handleSave}>
            Save
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
