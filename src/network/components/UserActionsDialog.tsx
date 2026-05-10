import { Button, Modal, Stack } from "@mantine/core";
import {
  IconCalendar,
  IconClipboardList,
  IconClockPlus,
  IconMessage,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { UserBadge } from "@/components/UserBadge";
import { useUserActionsDialog } from "@/network/hooks/dialogs/useUserActionsDialog";
import { useUserActionsDialogHandlers } from "@/network/hooks/dialogs/useUserActionsDialogHandlers";

export function UserActionsDialog() {
  const navigate = useNavigate();
  const { opened, user } = useUserActionsDialog();
  const { close } = useUserActionsDialogHandlers();

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "";

  const handleViewCalendar = () => {
    if (!user) return;
    navigate({ to: "/schedule", search: { userId: user.userId } });
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
          leftSection={<IconCalendar size={18} />}
          onClick={handleViewCalendar}
        >
          View calendar
        </Button>
        <Button
          variant="default"
          fullWidth
          justify="flex-start"
          leftSection={<IconMessage size={18} />}
          disabled
        >
          Ask a question
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
          disabled
        >
          Suggest task
        </Button>
      </Stack>
    </Modal>
  );
}
