import { Container, Stack, Title } from "@mantine/core";

import { DashboardTimer } from "@/timer/components/DashboardTimer";
import { AttentionItemsBucketFilters } from "./AttentionItemsBucketFilters";
import { AttentionItemsBuckets } from "./AttentionItemsBuckets";
import { AttentionItemsSearchInput } from "./AttentionItemsSearchInput";

export function AttentionItemsDashboard() {
  return (
    <Container size="xl" maw={1200} w="100%" py="lg">
      <Stack gap="lg">
        <Title order={2}>Dashboard</Title>
        <DashboardTimer />
        <AttentionItemsSearchInput />
        <AttentionItemsBucketFilters />
        <AttentionItemsBuckets />
      </Stack>
    </Container>
  );
}
