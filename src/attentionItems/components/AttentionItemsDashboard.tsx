import { Stack, Title } from "@mantine/core";

import { AttentionItemsBuckets } from "./AttentionItemsBuckets";
import { AttentionItemsSearchInput } from "./AttentionItemsSearchInput";

export function AttentionItemsDashboard() {
  return (
    <Stack gap="lg">
      <Title order={2}>Dashboard</Title>
      <AttentionItemsSearchInput />
      <AttentionItemsBuckets />
    </Stack>
  );
}
