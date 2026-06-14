import { ActionIcon, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";

import { useDeleteTaskBatch } from "@/tasks/hooks/mutations/useDeleteTaskBatch";

interface Props {
  batchId: string;
  taskCount: number;
  onDeleted?: () => void;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

// Red Delete trigger + a small confirm modal. Deleting a batch cascades to its
// child tasks, so we confirm first (the rest of the app deletes directly).
// iconOnly renders a compact trash ActionIcon for board cards; stopPropagation
// keeps the card's click/drag from firing.
export function BatchDeleteButton({
  batchId,
  taskCount,
  onDeleted,
  iconOnly = false,
  fullWidth = false,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const { deleteTaskBatch, isDeleting } = useDeleteTaskBatch();

  const handleConfirm = () => {
    deleteTaskBatch(batchId, {
      onSuccess: () => {
        close();
        onDeleted?.();
        notifications.show({ message: "Batch deleted" });
      },
    });
  };

  return (
    <>
      {iconOnly ? (
        <ActionIcon
          variant="subtle"
          color="red"
          size="sm"
          aria-label="Delete batch"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <IconTrash size={16} />
        </ActionIcon>
      ) : (
        <Button
          variant="subtle"
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={open}
          fullWidth={fullWidth}
        >
          Delete
        </Button>
      )}

      <Modal
        opened={opened}
        onClose={close}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        title="Delete batch?"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Removes the batch and its {taskCount}{" "}
            {taskCount === 1 ? "task" : "tasks"}. This can't be undone.
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
