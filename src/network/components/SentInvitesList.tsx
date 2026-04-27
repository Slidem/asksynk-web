import { Center, Divider, Loader, Paper, Stack, Text } from "@mantine/core";

import { SentInviteRow } from "@/network/components/SentInviteRow";
import { useSentInvitesQuery } from "@/network/hooks/queries/useSentInvitesQuery";

export function SentInvitesList() {
  const { data, isLoading, isError } = useSentInvitesQuery();

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return <Text c="red">Failed to load sent invites.</Text>;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        You haven't sent any invites yet.
      </Text>
    );
  }

  return (
    <Paper withBorder radius="md">
      <Stack gap={0}>
        {data.map((invite, idx) => (
          <div key={invite.id}>
            {idx > 0 && <Divider />}
            <SentInviteRow invite={invite} />
          </div>
        ))}
      </Stack>
    </Paper>
  );
}
