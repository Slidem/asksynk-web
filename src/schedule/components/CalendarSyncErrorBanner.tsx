import { Alert, Button, Group, Stack, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import { useErroredCalendarIntegrations } from "@/integrations/hooks/queries/useErroredCalendarIntegrations";
import { useConnectProvider } from "@/integrations/hooks/useConnectProvider";
import { getProvider } from "@/integrations/models/provider";
import { useIsViewingOwnCalendar } from "@/schedule/hooks/useIsViewingOwnCalendar";

export function CalendarSyncErrorBanner() {
  const isOwn = useIsViewingOwnCalendar();
  const { data: errored } = useErroredCalendarIntegrations();
  const { connect, isConnecting } = useConnectProvider();

  if (!isOwn || !errored || errored.length === 0) return null;

  return (
    <Alert
      color="red"
      variant="light"
      radius={0}
      icon={<IconAlertCircle size={18} />}
      title="Calendar sync error"
    >
      <Stack gap="sm">
        {errored.map((integration) => (
          <Group key={integration.id} justify="space-between" wrap="nowrap">
            <Text size="sm" lineClamp={2}>
              {getProvider(integration.provider)?.label ?? integration.provider}
              {": "}
              {integration.lastError ?? "Reconnect to restore sync."}
            </Text>
            <Button
              size="xs"
              variant="light"
              color="red"
              loading={isConnecting}
              onClick={() => connect(integration.provider)}
            >
              Reconnect
            </Button>
          </Group>
        ))}
      </Stack>
    </Alert>
  );
}
