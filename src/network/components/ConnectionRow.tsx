import { ActionIcon, Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import type { MouseEvent } from "react";

import type { NetworkConnectionDto } from "@/network/models/networkConnection";
import { UserBadge } from "@/components/UserBadge";
import { useUserActionsDialogHandlers } from "@/network/hooks/dialogs/userActionsDialogHooks";
import { useRemoveNetworkConnection } from "@/network/hooks/mutations/useRemoveNetworkConnection";

interface Props {
  connection: NetworkConnectionDto;
}

export function ConnectionRow({ connection }: Props) {
  const { remove, isRemoving } = useRemoveNetworkConnection();
  const { open } = useUserActionsDialogHandlers();

  const displayName =
    connection.name ||
    [connection.firstName, connection.lastName].filter(Boolean).join(" ") ||
    connection.email;

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Remove ${displayName} from your network?`)) return;
    remove(connection.userId);
  };

  return (
    <UnstyledButton
      onClick={() => open(connection)}
      px="md"
      py="sm"
      w="100%"
      style={{ display: "block" }}
    >
      <Group justify="space-between" wrap="nowrap">
        <UserBadge
          name={displayName}
          email={connection.email}
          image={connection.image}
          variant="full"
        />
        <Group gap="md" wrap="nowrap">
          <Text size="xs" c="dimmed">
            Connected {dayjs(connection.connectedAt).format("MMM D, YYYY")}
          </Text>
          <Tooltip label="Remove">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={handleRemove}
              loading={isRemoving}
              aria-label="Remove connection"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </UnstyledButton>
  );
}
