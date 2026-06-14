import { Button, Modal, Stack } from "@mantine/core";
import {
  IconClipboardList,
  IconClockHour4,
  IconClockPlus,
  IconMessage,
} from "@tabler/icons-react";

import { UserBadge } from "@/components/UserBadge";
import { useStartTaggedThread } from "@/messages/hooks/useStartTaggedThread";
import {
  useUserActionsDialog,
  useUserActionsDialogHandlers,
} from "@/network/hooks/dialogs/userActionsDialogHooks";
import { useUserAvailabilityDialogHandlers } from "@/network/hooks/dialogs/userAvailabilityDialogHooks";
import { useCreateTaskSuggestionDialogHandlers } from "@/tasks/hooks/dialogs/createTaskSuggestionDialogHooks";

export function UserActionsDialog() {
  const { opened, user } = useUserActionsDialog();
  const { close } = useUserActionsDialogHandlers();
  const { open: openAvailability } = useUserAvailabilityDialogHandlers();
  const { start, isStarting } = useStartTaggedThread();
  const { open: openSuggestion } = useCreateTaskSuggestionDialogHandlers();

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "";

  const handleShowAvailability = () => {
    if (!user) return;
    openAvailability(user);
    close();
  };

  const handleStartThread = async () => {
    if (!user) return;
    await start(user.userId, []);
    close();
  };

  const handleSuggestTask = () => {
    if (!user) return;
    openSuggestion({ suggesteeUserId: user.userId });
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        user ? (
          <UserBadge
            variant="full"
            name={displayName}
            email={user.email}
            image={user.image}
          />
        ) : null
      }
      size="md"
    >
      <Stack gap="sm">
        <Button
          variant="default"
          fullWidth
          justify="flex-start"
          leftSection={<IconClockHour4 size={18} />}
          onClick={handleShowAvailability}
        >
          Show availability
        </Button>
        <Button
          variant="default"
          fullWidth
          justify="flex-start"
          leftSection={<IconMessage size={18} />}
          onClick={handleStartThread}
          loading={isStarting}
        >
          Start a thread
        </Button>
        <Button
          variant="default"
          fullWidth
          justify="flex-start"
          leftSection={<IconClockPlus size={18} />}
          disabled
        >
          Suggest timeblock
        </Button>
        <Button
          variant="default"
          fullWidth
          justify="flex-start"
          leftSection={<IconClipboardList size={18} />}
          onClick={handleSuggestTask}
        >
          Suggest task
        </Button>
      </Stack>
    </Modal>
  );
}
