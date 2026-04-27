import { Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";

import type { InviteDto } from "@/network/models/invite";
import { InviteStatusBadge } from "@/network/components/InviteStatusBadge";

interface Props {
  invite: InviteDto;
}

export function SentInviteRow({ invite }: Props) {
  return (
    <Group justify="space-between" wrap="nowrap" px="md" py="sm">
      <Stack gap={2}>
        <Text fw={500}>{invite.inviteeEmail}</Text>
        <Text size="xs" c="dimmed">
          Sent {dayjs(invite.createdAt).format("MMM D, YYYY")}
        </Text>
      </Stack>
      <InviteStatusBadge status={invite.status} />
    </Group>
  );
}
