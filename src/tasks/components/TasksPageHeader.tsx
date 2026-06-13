import { Button, Group, Title } from "@mantine/core";
import { IconPlus, IconStack2, IconUserShare } from "@tabler/icons-react";

import { useCreateTaskDialogHandlers } from "@/tasks/hooks/dialogs/createTaskDialogHooks";
import { useCreateTaskBatchDialogHandlers } from "@/tasks/hooks/dialogs/createTaskBatchDialogHooks";
import { useCreateTaskSuggestionDialogHandlers } from "@/tasks/hooks/dialogs/createTaskSuggestionDialogHooks";

export function TasksPageHeader() {
  const { open: openTask } = useCreateTaskDialogHandlers();
  const { open: openBatch } = useCreateTaskBatchDialogHandlers();
  const { open: openSuggestion } = useCreateTaskSuggestionDialogHandlers();

  return (
    <Group justify="space-between" align="center">
      <Title order={2}>Tasks</Title>
      <Group gap="xs">
        <Button
          variant="default"
          leftSection={<IconUserShare size={16} />}
          onClick={() => openSuggestion()}
        >
          Suggest task
        </Button>
        <Button
          variant="default"
          leftSection={<IconStack2 size={16} />}
          onClick={() => openBatch()}
        >
          New batch
        </Button>
        <Button leftSection={<IconPlus size={16} />} onClick={() => openTask()}>
          New task
        </Button>
      </Group>
    </Group>
  );
}
