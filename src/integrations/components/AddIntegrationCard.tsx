import { Card, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { useOpenAddIntegrationDialog } from "@/integrations/hooks/dialogs/addIntegrationDialogHooks";

export function AddIntegrationCard() {
  const open = useOpenAddIntegrationDialog();

  return (
    <Card
      radius="lg"
      padding="lg"
      withBorder
      mih={210}
      style={{
        cursor: "pointer",
        height: "100%",
        borderStyle: "dashed",
      }}
      onClick={open}
    >
      <Stack align="center" justify="center" gap="sm" h="100%">
        <ThemeIcon variant="light" radius="xl" size={52}>
          <IconPlus size={28} />
        </ThemeIcon>
        <Text fw={600} c="dimmed">
          Add integration
        </Text>
      </Stack>
    </Card>
  );
}
