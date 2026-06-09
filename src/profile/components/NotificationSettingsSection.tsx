import { useUserSettings } from "@/profile/hooks/queries/useUserSettings";
import { useUpdateUserSettings } from "@/profile/hooks/mutations/useUpdateUserSettings";
import type { UserSettingsDto } from "@/profile/models/userSettings";
import { Group, Paper, Stack, Switch, Title } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";

export function NotificationSettingsSection() {
  const { data: settings } = useUserSettings();
  const { updateUserSettings, isUpdating } = useUpdateUserSettings();

  const handleToggle = (field: keyof UserSettingsDto, checked: boolean) => {
    if (!settings) return;
    updateUserSettings({ ...settings, [field]: checked });
  };

  return (
    <Paper p="lg" radius="lg" shadow="sm" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconBell size={20} />
          <Title order={3}>Notifications</Title>
        </Group>

        <Switch
          label="Attention item notifications"
          description="Get notified about new attention items."
          checked={settings?.attentionItemNotifications ?? false}
          disabled={!settings || isUpdating}
          onChange={(event) =>
            handleToggle("attentionItemNotifications", event.currentTarget.checked)
          }
        />
        <Switch
          label="Timer notifications"
          description="Get notified when a timer session ends."
          checked={settings?.timerNotifications ?? false}
          disabled={!settings || isUpdating}
          onChange={(event) =>
            handleToggle("timerNotifications", event.currentTarget.checked)
          }
        />
      </Stack>
    </Paper>
  );
}
