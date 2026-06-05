import {
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import {
  DEFAULT_TIMER_SETTINGS_FORM_VALUES,
  TIMER_SETTINGS_PRESETS,
  formToSettings,
  settingsToForm,
  type TimerSettingsFormValues,
} from "@/timer/models/timerSettingsForm";
import { sessionTypeLabel } from "@/timer/models/timer";
import {
  useIsTimerSettingsDialogOpened,
  useTimerSettingsDialogHandlers,
} from "@/timer/hooks/dialogs/timerSettingsDialogHooks";
import { useTimerSettings } from "@/timer/hooks/queries/useTimerSettings";
import { useTimerSuggestion } from "@/timer/hooks/queries/useTimerSuggestion";
import { useUpdateTimerSettings } from "@/timer/hooks/mutations/useUpdateTimerSettings";
import { useTimerSoundSettingsStore } from "@/timer/sounds/useTimerSoundSettingsStore";
import {
  canUseNotifications,
  requestNotificationPermission,
} from "@/timer/utils/browserNotification";

const minutesValidator = (value: number) =>
  value >= 1 && value <= 1440 ? null : "Between 1 and 1440 minutes";

type NotificationState = NotificationPermission | "unsupported";

export function TimerSettingsDialog() {
  const opened = useIsTimerSettingsDialogOpened();
  const { close } = useTimerSettingsDialogHandlers();
  const { data: settings } = useTimerSettings();
  const { data: suggestion } = useTimerSuggestion({ enabled: opened });
  const updateMutation = useUpdateTimerSettings();

  const soundEnabled = useTimerSoundSettingsStore((s) => s.enabled);
  const volume = useTimerSoundSettingsStore((s) => s.volume);
  const setSoundEnabled = useTimerSoundSettingsStore((s) => s.setEnabled);
  const setVolume = useTimerSoundSettingsStore((s) => s.setVolume);

  const [notifState, setNotifState] = useState<NotificationState>(
    canUseNotifications() ? Notification.permission : "unsupported",
  );

  const form = useForm<TimerSettingsFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TIMER_SETTINGS_FORM_VALUES,
    validate: {
      focusMinutes: minutesValidator,
      shortBreakMinutes: minutesValidator,
      longBreakMinutes: minutesValidator,
      longBreakInterval: (value) =>
        value >= 1 && value <= 50 ? null : "Between 1 and 50",
    },
  });

  useEffect(() => {
    if (opened && settings) {
      form.setValues(settingsToForm(settings));
    }
  }, [opened, settings]);

  const handleClose = () => {
    form.reset();
    close();
  };

  const handleSave = () => {
    if (form.validate().hasErrors) return;
    updateMutation.mutate(formToSettings(form.getValues()));
    handleClose();
  };

  const handleToggleDesktop = async () => {
    const result = await requestNotificationPermission();
    if (result !== "unsupported") setNotifState(result);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Timer settings"
      size="md"
      centered
    >
      <Stack gap="md">
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Presets:
          </Text>
          {TIMER_SETTINGS_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="default"
              size="xs"
              radius="xl"
              onClick={() => form.setValues(preset.values)}
            >
              {preset.label}
            </Button>
          ))}
        </Group>

        <SimpleGrid cols={2}>
          <NumberInput
            label="Focus (min)"
            min={1}
            max={1440}
            clampBehavior="strict"
            allowDecimal={false}
            key={form.key("focusMinutes")}
            {...form.getInputProps("focusMinutes")}
          />
          <NumberInput
            label="Long break interval"
            description="Long break after N focus sessions"
            min={1}
            max={50}
            clampBehavior="strict"
            allowDecimal={false}
            key={form.key("longBreakInterval")}
            {...form.getInputProps("longBreakInterval")}
          />
          <NumberInput
            label="Short break (min)"
            min={1}
            max={1440}
            clampBehavior="strict"
            allowDecimal={false}
            key={form.key("shortBreakMinutes")}
            {...form.getInputProps("shortBreakMinutes")}
          />
          <NumberInput
            label="Long break (min)"
            min={1}
            max={1440}
            clampBehavior="strict"
            allowDecimal={false}
            key={form.key("longBreakMinutes")}
            {...form.getInputProps("longBreakMinutes")}
          />
        </SimpleGrid>

        {suggestion && (
          <Text size="sm" c="dimmed">
            Next break: {sessionTypeLabel(suggestion.suggestedSessionType)} ·{" "}
            {suggestion.completedFocusSessions}/{suggestion.longBreakInterval}{" "}
            focus sessions
          </Text>
        )}

        <Divider label="Sounds" labelPosition="left" />

        <Switch
          label="Sound"
          checked={soundEnabled}
          onChange={(event) => setSoundEnabled(event.currentTarget.checked)}
        />
        {soundEnabled && (
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={setVolume}
            label={(value) => `${Math.round(value * 100)}%`}
          />
        )}

        {notifState !== "unsupported" && (
          <Switch
            label="Desktop notifications"
            description={
              notifState === "denied"
                ? "Blocked — enable in your browser settings"
                : "Alert when a session ends in a background tab"
            }
            checked={notifState === "granted"}
            disabled={notifState !== "default"}
            onChange={handleToggleDesktop}
          />
        )}

        <Text size="xs" c="dimmed">
          Changes apply to your next session.
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={updateMutation.isPending}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
