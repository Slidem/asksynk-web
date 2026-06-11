import {
  Badge,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";

import {
  INTEGRATION_PROVIDERS,
  getProvider,
} from "@/integrations/models/provider";
import {
  useAddIntegrationDialogHandlers,
  useAddIntegrationDialogState,
} from "@/integrations/hooks/dialogs/addIntegrationDialogHooks";
import { useConnectProvider } from "@/integrations/hooks/useConnectProvider";

export function AddIntegrationDialog() {
  const { opened, step, providerId } = useAddIntegrationDialogState();
  const { selectProvider, back, close } = useAddIntegrationDialogHandlers();
  const { connect, isConnecting } = useConnectProvider();

  const provider = providerId ? getProvider(providerId) : undefined;
  const title =
    step === "connect" && provider ? `Connect ${provider.label}` : "Add integration";

  return (
    <Modal opened={opened} onClose={close} title={title} size="md">
      {step === "select" ? (
        <Stack gap="sm">
          {INTEGRATION_PROVIDERS.map((p) => {
            const Icon = p.icon;
            return (
              <UnstyledButton
                key={p.id}
                disabled={!p.available}
                onClick={() => p.available && selectProvider(p.id)}
                style={{
                  cursor: p.available ? "pointer" : "not-allowed",
                  opacity: p.available ? 1 : 0.55,
                  borderRadius: "var(--mantine-radius-md)",
                  border: "1px solid var(--mantine-color-default-border)",
                  padding: "var(--mantine-spacing-sm)",
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon variant="light" radius="md" size={40}>
                      <Icon size={22} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text fw={600}>{p.label}</Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {p.description}
                      </Text>
                    </Stack>
                  </Group>
                  {p.available ? (
                    <IconChevronRight
                      size={18}
                      color="var(--mantine-color-dimmed)"
                    />
                  ) : (
                    <Badge variant="light" color="gray" radius="sm">
                      Coming soon
                    </Badge>
                  )}
                </Group>
              </UnstyledButton>
            );
          })}
        </Stack>
      ) : (
        provider && (
          <Stack gap="md">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon variant="light" radius="md" size={48}>
                <provider.icon size={26} />
              </ThemeIcon>
              <Text>{provider.description}</Text>
            </Group>
            <Text size="sm" c="dimmed">
              You'll be redirected to {provider.label} to grant access. Calendars
              import read-only by default; you choose which ones sync afterwards.
            </Text>
            <Group justify="space-between" mt="sm">
              <Button
                variant="default"
                leftSection={<IconArrowLeft size={16} />}
                onClick={back}
              >
                Back
              </Button>
              <Button
                loading={isConnecting}
                onClick={() => connect(provider.id)}
              >
                Connect {provider.label}
              </Button>
            </Group>
          </Stack>
        )
      )}
    </Modal>
  );
}
