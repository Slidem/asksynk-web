import { Button, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconPlugConnected } from "@tabler/icons-react";

import type { CalendarIntegrationDto } from "@/integrations/models/calendarIntegration";
import { getProvider } from "@/integrations/models/provider";
import { useConnectProvider } from "@/integrations/hooks/useConnectProvider";
import { useOpenManageIntegrationDialog } from "@/integrations/hooks/dialogs/manageIntegrationDialogHooks";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";

const SYNC_DIRECTION_LABEL: Record<string, string> = {
  readonly: "Read-only",
  bidirectional: "Two-way sync",
};

export function IntegrationCard({
  integration,
}: {
  integration: CalendarIntegrationDto;
}) {
  const provider = getProvider(integration.provider);
  const Icon = provider?.icon ?? IconPlugConnected;
  const openManage = useOpenManageIntegrationDialog();
  const { connect, isConnecting } = useConnectProvider();

  const enabledCount = integration.calendars.filter(
    (c) => c.syncEnabled,
  ).length;
  const totalCount = integration.calendars.length;

  return (
    <Card
      radius="lg"
      shadow="sm"
      padding="lg"
      withBorder
      mih={210}
      style={{ cursor: "pointer", height: "100%" }}
      onClick={() => openManage(integration.id)}
    >
      <Stack gap="md" justify="space-between" h="100%">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon variant="light" radius="md" size={44}>
              <Icon size={24} />
            </ThemeIcon>
            <Stack gap={2}>
              <Text fw={700}>{provider?.label ?? integration.provider}</Text>
              {integration.accountEmail && (
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {integration.accountEmail}
                </Text>
              )}
            </Stack>
          </Group>
          <IntegrationStatusBadge status={integration.status} />
        </Group>

        {integration.status === "error" ? (
          <Stack gap="xs">
            <Text size="sm" c="red" lineClamp={2}>
              {integration.lastError ?? "Reconnect to restore sync."}
            </Text>
            <Button
              size="xs"
              variant="light"
              color="red"
              loading={isConnecting}
              onClick={(e) => {
                e.stopPropagation();
                connect(integration.provider);
              }}
            >
              Reconnect
            </Button>
          </Stack>
        ) : (
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {enabledCount} of {totalCount} calendars syncing
            </Text>
            <Text size="sm" c="dimmed">
              {SYNC_DIRECTION_LABEL[integration.syncDirection] ??
                integration.syncDirection}
            </Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
