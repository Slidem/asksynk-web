import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";

import { InviteStatusBadge } from "@/network/components/InviteStatusBadge";
import { useAcceptInvite } from "@/network/hooks/mutations/useAcceptInvite";
import { useReceivedInvitesQuery } from "@/network/hooks/queries/useReceivedInvitesQuery";
import { useRejectInvite } from "@/network/hooks/mutations/useRejectInvite";

interface Props {
  inviteId: string;
}

export function InviteResponsePage({ inviteId }: Props) {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useReceivedInvitesQuery();
  const { accept, isAccepting } = useAcceptInvite();
  const { reject, isRejecting } = useRejectInvite();

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Container size="sm" py="xl">
        <Text c="red">Failed to load invite.</Text>
      </Container>
    );
  }

  const invite = (data ?? []).find((i) => i.id === inviteId);

  if (!invite) {
    return (
      <Container size="sm" py="xl">
        <Paper p="lg" withBorder radius="md">
          <Stack gap="md">
            <Title order={3}>Invite not found</Title>
            <Text c="dimmed">
              This invite may have been withdrawn or already handled.
            </Text>
            <Button onClick={() => navigate({ to: "/network" })}>
              Go to network
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const isPending = invite.status === "pending";

  const handleAccept = () =>
    accept(invite.id, {
      onSuccess: () => navigate({ to: "/network" }),
    });

  const handleReject = () =>
    reject(invite.id, {
      onSuccess: () => navigate({ to: "/network" }),
    });

  return (
    <Container size="sm" py="xl">
      <Paper p="lg" withBorder radius="lg" shadow="sm">
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={2}>Network invite</Title>
            <Text c="dimmed">
              Received {dayjs(invite.createdAt).format("MMM D, YYYY HH:mm")}
            </Text>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              From
            </Text>
            <Text fw={500}>User {invite.inviterUserId.slice(0, 8)}…</Text>
          </Stack>

          {!isPending && (
            <Group>
              <Text size="sm" c="dimmed">
                Status:
              </Text>
              <InviteStatusBadge status={invite.status} />
            </Group>
          )}

          {isPending && (
            <Group justify="flex-end">
              <Button
                variant="default"
                onClick={handleReject}
                loading={isRejecting}
              >
                Reject
              </Button>
              <Button onClick={handleAccept} loading={isAccepting}>
                Accept
              </Button>
            </Group>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
