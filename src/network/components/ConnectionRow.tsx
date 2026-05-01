import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

import type { NetworkConnectionDto } from "@/network/models/networkConnection";
import { UserBadge } from "@/components/UserBadge";
import { useRemoveNetworkConnection } from "@/network/hooks/mutations/useRemoveNetworkConnection";

interface Props {
  connection: NetworkConnectionDto;
}

export function ConnectionRow({ connection }: Props) {
  const { remove, isRemoving } = useRemoveNetworkConnection();

  const displayName =
    connection.name ||
    [connection.firstName, connection.lastName].filter(Boolean).join(" ") ||
    connection.email;

  const handleRemove = () => {
    if (!window.confirm(`Remove ${displayName} from your network?`)) return;
    remove(connection.userId);
  };

  return (
    <Group justify="space-between" wrap="nowrap" px="md" py="sm">
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
  );
}
