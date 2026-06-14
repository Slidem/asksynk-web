import { Button, Group, Menu, Title } from "@mantine/core";
import {
  IconChevronDown,
  IconPlus,
  IconStack2,
  IconUserShare,
} from "@tabler/icons-react";

import { useCreateTaskDialogHandlers } from "@/tasks/hooks/dialogs/createTaskDialogHooks";
import { useCreateTaskBatchDialogHandlers } from "@/tasks/hooks/dialogs/createTaskBatchDialogHooks";
import { useCreateTaskSuggestionDialogHandlers } from "@/tasks/hooks/dialogs/createTaskSuggestionDialogHooks";

export function TasksPageHeader() {
  const { open: openTask } = useCreateTaskDialogHandlers();
  const { open: openBatch } = useCreateTaskBatchDialogHandlers();
  const { open: openSuggestion } = useCreateTaskSuggestionDialogHandlers();

  return (
    <Group justify="space-between" align="center" wrap="nowrap">
      <Title order={2}>Tasks</Title>

      <Group gap="xs" visibleFrom="sm">
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

      <Menu position="bottom-end">
        <Menu.Target>
          <Button
            hiddenFrom="sm"
            leftSection={<IconPlus size={16} />}
            rightSection={<IconChevronDown size={14} />}
          >
            New
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconPlus size={16} />}
            onClick={() => openTask()}
          >
            New task
          </Menu.Item>
          <Menu.Item
            leftSection={<IconStack2 size={16} />}
            onClick={() => openBatch()}
          >
            New batch
          </Menu.Item>
          <Menu.Item
            leftSection={<IconUserShare size={16} />}
            onClick={() => openSuggestion()}
          >
            Suggest task
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
