import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import { IconNetwork, IconUserPlus } from "@tabler/icons-react";

import { useInviteDialogHandlers } from "@/network/hooks/dialogs/inviteDialogHooks";

export function NetworkPageHeader() {
  const { open } = useInviteDialogHandlers();

  return (
    <Paper p="lg" radius="lg" shadow="sm" withBorder>
      <Group justify="space-between" align="center" wrap="wrap">
        <Stack gap={4}>
          <Group gap="xs">
            <IconNetwork size={22} />
            <Title order={2}>Network</Title>
          </Group>
        </Stack>
        <Button leftSection={<IconUserPlus size={18} />} onClick={open}>
          Invite by email
        </Button>
      </Group>
    </Paper>
  );
}
