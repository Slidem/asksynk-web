import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy, IconTrash, IconUsers } from "@tabler/icons-react";
import dayjs from "dayjs";

import { useRevokePublicView } from "@/public-views/hooks/mutations/useRevokePublicView";
import { usePublicViewGuestsDialogHandlers } from "@/public-views/hooks/dialogs/publicViewGuestsDialogHooks";
import type { PublicViewDto } from "@/public-views/models/publicView";
import { useMemo } from "react";

interface Props {
  view: PublicViewDto;
}

export function PublicViewRow({ view }: Props) {
  const { revoke, isRevoking } = useRevokePublicView();
  const { open: openGuests } = usePublicViewGuestsDialogHandlers();

  const displayName = view.name || `Untitled (${view.slug})`;

  const expired = useMemo(
    () => new Date(view.expiresAt).getTime() < new Date().getTime(),
    [view.expiresAt],
  );

  const guestCount = view.guestCount ?? 0;

  const handleRevoke = () => {
    if (
      !window.confirm(`Revoke "${displayName}"? This invalidates all guests.`)
    ) {
      return;
    }
    revoke(view.id);
  };

  return (
    <Group justify="space-between" wrap="nowrap" px="md" py="sm">
      <Stack gap={4} style={{ minWidth: 0 }}>
        <Group gap="xs" wrap="nowrap">
          <Text fw={500} truncate>
            {displayName}
          </Text>
          {expired && (
            <Badge color="red" variant="light" size="xs">
              Expired
            </Badge>
          )}
        </Group>
        <Text size="xs" c="dimmed" truncate>
          {view.url}
        </Text>
        <Group gap="md">
          <Text size="xs" c="dimmed">
            Expires {dayjs(view.expiresAt).format("MMM D, YYYY HH:mm")}
          </Text>
          <Text size="xs" c="dimmed">
            Created {dayjs(view.createdAt).format("MMM D, YYYY")}
          </Text>
        </Group>
      </Stack>

      <Group gap="xs" wrap="nowrap">
        <Button
          size="xs"
          variant="light"
          leftSection={<IconUsers size={14} />}
          onClick={() => openGuests(view.id)}
        >
          {guestCount} {guestCount === 1 ? "guest" : "guests"}
        </Button>

        <CopyButton value={view.url} timeout={1500}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? "Copied" : "Copy link"}>
              <ActionIcon
                variant="subtle"
                onClick={copy}
                aria-label="Copy link"
              >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>

        <Tooltip label="Revoke">
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={handleRevoke}
            loading={isRevoking}
            aria-label="Revoke view"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
