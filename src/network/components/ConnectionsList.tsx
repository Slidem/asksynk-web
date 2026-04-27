import { Center, Divider, Loader, Paper, Stack, Text } from "@mantine/core";

import { ConnectionRow } from "@/network/components/ConnectionRow";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";

export function ConnectionsList() {
  const { data, isLoading, isError } = useNetworkConnectionsQuery();

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return <Text c="red">Failed to load your network.</Text>;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No connections yet. Invite someone by email.
      </Text>
    );
  }

  return (
    <Paper withBorder radius="md">
      <Stack gap={0}>
        {data.map((c, idx) => (
          <div key={c.userId}>
            {idx > 0 && <Divider />}
            <ConnectionRow connection={c} />
          </div>
        ))}
      </Stack>
    </Paper>
  );
}
