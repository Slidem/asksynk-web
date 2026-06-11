import {
  Button,
  ColorSwatch,
  Divider,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

import type {
  SyncDirection,
  UpdateIntegrationInput,
} from "@/integrations/models/calendarIntegration";
import { getProvider } from "@/integrations/models/provider";
import { useCalendarIntegrations } from "@/integrations/hooks/queries/useCalendarIntegrations";
import { useUpdateIntegration } from "@/integrations/hooks/mutations/useUpdateIntegration";
import { useDisconnectIntegration } from "@/integrations/hooks/mutations/useDisconnectIntegration";
import {
  useCloseManageIntegrationDialog,
  useManageIntegrationDialogState,
} from "@/integrations/hooks/dialogs/manageIntegrationDialogHooks";
import { useConnectProvider } from "@/integrations/hooks/useConnectProvider";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";

export function ManageIntegrationDialog() {
  const { opened, integrationId } = useManageIntegrationDialogState();
  const close = useCloseManageIntegrationDialog();
  const { data: integrations } = useCalendarIntegrations();
  const updateMutation = useUpdateIntegration();
  const disconnectMutation = useDisconnectIntegration();
  const { connect, isConnecting } = useConnectProvider();

  const integration = useMemo(
    () => integrations?.find((i) => i.id === integrationId) ?? null,
    [integrations, integrationId],
  );

  const [syncDirection, setSyncDirection] = useState<SyncDirection>("readonly");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false);

  useEffect(() => {
    if (!opened || !integration) return;
    setSyncDirection(integration.syncDirection);
    setEnabled(
      Object.fromEntries(
        integration.calendars.map((c) => [c.id, c.syncEnabled]),
      ),
    );
    setConfirmingDisconnect(false);
  }, [opened, integration]);

  const provider = integration ? getProvider(integration.provider) : undefined;

  const handleSave = async () => {
    if (!integration) return;

    const input: UpdateIntegrationInput = {};
    if (syncDirection !== integration.syncDirection) {
      input.syncDirection = syncDirection;
    }
    const changedCalendars = integration.calendars
      .filter((c) => enabled[c.id] !== c.syncEnabled)
      .map((c) => ({ calendarId: c.id, syncEnabled: enabled[c.id] }));
    if (changedCalendars.length > 0) {
      input.calendars = changedCalendars;
    }

    if (!input.syncDirection && !input.calendars) {
      close();
      return;
    }

    await updateMutation.mutateAsync({ id: integration.id, input });
    close();
  };

  const handleDisconnect = async () => {
    if (!integration) return;
    await disconnectMutation.mutateAsync(integration.id);
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={provider?.label ?? integration?.provider ?? "Integration"}
      size="md"
    >
      {integration && (
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {integration.accountEmail}
            </Text>
            <IntegrationStatusBadge status={integration.status} />
          </Group>

          {integration.status === "error" && (
            <Stack gap="xs">
              <Text size="sm" c="red">
                {integration.lastError ?? "Reconnect to restore sync."}
              </Text>
              <Button
                size="xs"
                variant="light"
                color="red"
                w="fit-content"
                loading={isConnecting}
                onClick={() => connect(integration.provider)}
              >
                Reconnect
              </Button>
            </Stack>
          )}

          <Stack gap={6}>
            <Text size="sm" fw={500}>
              Sync direction
            </Text>
            <SegmentedControl
              value={syncDirection}
              onChange={(v) => setSyncDirection(v as SyncDirection)}
              data={[
                { label: "Read-only", value: "readonly" },
                { label: "Two-way sync", value: "bidirectional" },
              ]}
            />
            <Text size="xs" c="dimmed">
              {syncDirection === "bidirectional"
                ? "Asksynk events are mirrored to your primary calendar."
                : "External events are imported; nothing is pushed out."}
            </Text>
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Calendars
            </Text>
            {integration.calendars.map((c) => (
              <Group key={c.id} justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <ColorSwatch
                    size={14}
                    color={c.color ?? "var(--mantine-color-gray-5)"}
                  />
                  <Text size="sm" lineClamp={1}>
                    {c.name ?? c.externalId}
                  </Text>
                </Group>
                <Switch
                  checked={enabled[c.id] ?? false}
                  onChange={(e) => {
                    const checked = e.currentTarget.checked;
                    setEnabled((prev) => ({ ...prev, [c.id]: checked }));
                  }}
                />
              </Group>
            ))}
            <Text size="xs" c="dimmed">
              Newly enabled calendars import within ~5 minutes.
            </Text>
          </Stack>

          <Divider />

          <Group justify="space-between">
            {confirmingDisconnect ? (
              <Group gap="xs">
                <Button
                  variant="default"
                  size="xs"
                  onClick={() => setConfirmingDisconnect(false)}
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  size="xs"
                  loading={disconnectMutation.isPending}
                  onClick={handleDisconnect}
                >
                  Confirm disconnect
                </Button>
              </Group>
            ) : (
              <Button
                variant="subtle"
                color="red"
                onClick={() => setConfirmingDisconnect(true)}
              >
                Disconnect
              </Button>
            )}
            <Button loading={updateMutation.isPending} onClick={handleSave}>
              Save
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
