import { Center, Divider, Loader, Paper, Stack, Text } from "@mantine/core";

import { ReceivedInviteRow } from "@/network/components/ReceivedInviteRow";
import { useReceivedInvitesQuery } from "@/network/hooks/queries/useReceivedInvitesQuery";

export function ReceivedInvitesList() {
  const { data, isLoading, isError } = useReceivedInvitesQuery();

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return <Text c="red">Failed to load invites.</Text>;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No invites yet.
      </Text>
    );
  }

  return (
    <Paper withBorder radius="md">
      <Stack gap={0}>
        {data.map((invite, idx) => (
          <div key={invite.id}>
            {idx > 0 && <Divider />}
            <ReceivedInviteRow invite={invite} />
          </div>
        ))}
      </Stack>
    </Paper>
  );
}
