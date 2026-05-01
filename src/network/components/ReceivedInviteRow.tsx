import { Button, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";

import type { InviteDto } from "@/network/models/invite";
import { InviteStatusBadge } from "@/network/components/InviteStatusBadge";
import { UserBadge } from "@/components/UserBadge";
import { useAcceptInvite } from "@/network/hooks/mutations/useAcceptInvite";
import { useRejectInvite } from "@/network/hooks/mutations/useRejectInvite";

interface Props {
  invite: InviteDto;
}

export function ReceivedInviteRow({ invite }: Props) {
  const { accept, isAccepting } = useAcceptInvite();
  const { reject, isRejecting } = useRejectInvite();
  const isPending = invite.status === "pending";

  return (
    <Group justify="space-between" wrap="nowrap" px="md" py="sm">
      <Stack gap={2}>
        <UserBadge email={invite.inviteeEmail} variant="full" />
        <Text size="xs" c="dimmed">
          Received {dayjs(invite.createdAt).format("MMM D, YYYY")}
        </Text>
      </Stack>

      {isPending ? (
        <Group gap="xs">
          <Button
            size="xs"
            variant="default"
            onClick={() => reject(invite.id)}
            loading={isRejecting}
          >
            Reject
          </Button>
          <Button
            size="xs"
            onClick={() => accept(invite.id)}
            loading={isAccepting}
          >
            Accept
          </Button>
        </Group>
      ) : (
        <InviteStatusBadge status={invite.status} />
      )}
    </Group>
  );
}
