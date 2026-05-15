import { Button, Modal, Stack } from "@mantine/core";
import {
  IconClipboardList,
  IconClockHour4,
  IconClockPlus,
} from "@tabler/icons-react";

import { UserBadge } from "@/components/UserBadge";
import {
  useUserActionsDialog,
  useUserActionsDialogHandlers,
} from "@/network/hooks/dialogs/userActionsDialogHooks";
import { useUserAvailabilityDialogHandlers } from "@/network/hooks/dialogs/userAvailabilityDialogHooks";

export function UserActionsDialog() {
  const { opened, user } = useUserActionsDialog();
  const { close } = useUserActionsDialogHandlers();
  const { open: openAvailability } = useUserAvailabilityDialogHandlers();

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
