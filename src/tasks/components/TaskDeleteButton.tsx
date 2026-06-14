import { ActionIcon, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";

import { useDeleteTask } from "@/tasks/hooks/mutations/useDeleteTask";

interface Props {
  taskId: string;
  onDeleted?: () => void;
}

// Small red trash icon + confirm modal on a task card. stopPropagation keeps the
// click from opening the card (onClick) or starting a dnd drag (onPointerDown).
export function TaskDeleteButton({ taskId, onDeleted }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const { deleteTask, isDeleting } = useDeleteTask();

  const handleConfirm = () => {
    deleteTask(taskId, {
      onSuccess: () => {
        close();
        onDeleted?.();
        notifications.show({ message: "Task deleted" });
      },
    });
  };

  return (
    <>
      <ActionIcon
        variant="subtle"
        color="red"
        size="sm"
        aria-label="Delete task"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <IconTrash size={16} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={close}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        title="Delete task?"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            This can't be undone.
          </Text>
          <Group justify="flex-end" gap="xs">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button color="red" loading={isDeleting} onClick={handleConfirm}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
