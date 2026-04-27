import { Center, Divider, Loader, Paper, Stack, Text } from "@mantine/core";

import { PublicViewRow } from "@/public-views/components/PublicViewRow";
import { usePublicViewsQuery } from "@/public-views/hooks/queries/usePublicViewsQuery";

export function PublicViewsList() {
  const { data, isLoading, isError } = usePublicViewsQuery();

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return <Text c="red">Failed to load public views.</Text>;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No public views yet. Create one to share your schedule.
      </Text>
    );
  }

  return (
    <Paper withBorder radius="md">
      <Stack gap={0}>
        {data.map((view, idx) => (
          <div key={view.id}>
            {idx > 0 && <Divider />}
            <PublicViewRow view={view} />
          </div>
        ))}
      </Stack>
    </Paper>
  );
}
