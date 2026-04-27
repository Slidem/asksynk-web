import { ActionIcon, Avatar, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

import type { NetworkConnectionDto } from "@/network/models/networkConnection";
import { useRemoveNetworkConnection } from "@/network/hooks/mutations/useRemoveNetworkConnection";

interface Props {
  connection: NetworkConnectionDto;
}

function getInitials(connection: NetworkConnectionDto) {
  const source =
    connection.name ||
    [connection.firstName, connection.lastName].filter(Boolean).join(" ") ||
    connection.email;
  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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
      <Group gap="md" wrap="nowrap">
        <Avatar src={connection.image} radius="xl" color="blue">
          {getInitials(connection)}
        </Avatar>
        <Stack gap={2}>
          <Text fw={500}>{displayName}</Text>
          <Text size="xs" c="dimmed">
            {connection.email}
          </Text>
        </Stack>
      </Group>
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
