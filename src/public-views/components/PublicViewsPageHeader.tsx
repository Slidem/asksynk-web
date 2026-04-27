import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import { IconPlus, IconShare } from "@tabler/icons-react";

import { useCreatePublicViewDialogHandlers } from "@/public-views/hooks/dialogs/createPublicViewDialogHooks";

export function PublicViewsPageHeader() {
  const { open } = useCreatePublicViewDialogHandlers();

  return (
    <Paper p="lg" radius="lg" shadow="sm" withBorder>
      <Group justify="space-between" align="center" wrap="wrap">
        <Stack gap={4}>
          <Group gap="xs">
            <IconShare size={22} />
            <Title order={2}>Public views</Title>
          </Group>
        </Stack>
        <Button leftSection={<IconPlus size={18} />} onClick={open}>
          Create public view
        </Button>
      </Group>
    </Paper>
  );
}
