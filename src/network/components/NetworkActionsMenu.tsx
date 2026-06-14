import { Button, Menu } from "@mantine/core";
import {
  IconChevronDown,
  IconClipboardList,
  IconMessage,
} from "@tabler/icons-react";

import { useStartTaggedThread } from "@/messages/hooks/useStartTaggedThread";
import { useCreateTaskSuggestionDialogHandlers } from "@/tasks/hooks/dialogs/createTaskSuggestionDialogHooks";

interface Props {
  // Recipient (thread) + suggestee (task suggestion).
  userId: string;
  // Preset tags for both actions; the suggestee's own tags.
  tagIds?: string[];
  // Close parent dialog(s) after an action fires.
  onAfterAction?: () => void;
  size?: string;
  variant?: string;
}

export function NetworkActionsMenu({
  userId,
  tagIds = [],
  onAfterAction,
  size = "xs",
  variant = "light",
}: Props) {
  const { start, isStarting } = useStartTaggedThread();
  const { open: openSuggestion } = useCreateTaskSuggestionDialogHandlers();

  const handleStartThread = async () => {
    await start(userId, tagIds);
    onAfterAction?.();
  };

  const handleSuggestTask = () => {
    openSuggestion({ suggesteeUserId: userId, tagIds });
    onAfterAction?.();
  };

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <Button
          size={size}
          variant={variant}
          rightSection={<IconChevronDown size={14} />}
          loading={isStarting}
        >
          Actions
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconMessage size={14} />}
          onClick={handleStartThread}
        >
          Start a thread
        </Menu.Item>
        <Menu.Item
          leftSection={<IconClipboardList size={14} />}
          onClick={handleSuggestTask}
        >
          Suggest a task
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
