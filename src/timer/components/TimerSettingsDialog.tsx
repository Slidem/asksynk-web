import {
  Alert,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Text,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertTriangle,
  IconBolt,
  IconBrain,
  IconClock,
  IconCoffee,
  IconHourglass,
  IconInfoCircle,
  IconMoon,
  IconRepeat,
  IconVolume,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  DEFAULT_TIMER_SETTINGS_FORM_VALUES,
  INACTIVITY_TIMEOUT_OPTIONS,
  TIMER_SETTINGS_PRESETS,
  differsFromSnapshot,
  formToSettings,
  settingsToForm,
  type TimerSettingsFormValues,
} from "@/timer/models/timerSettingsForm";
import { useTimer } from "@/timer/hooks/queries/useTimer";
import {
  useIsTimerSettingsDialogOpened,
  useTimerSettingsDialogHandlers,
} from "@/timer/hooks/dialogs/timerSettingsDialogHooks";
import { useTimerSettings } from "@/timer/hooks/queries/useTimerSettings";
import { useUpdateTimerSettings } from "@/timer/hooks/mutations/useUpdateTimerSettings";
import { useTimerSoundSettingsStore } from "@/timer/sounds/useTimerSoundSettingsStore";
import {
  canUseNotifications,
  requestNotificationPermission,
} from "@/lib/browserNotification";

const minutesValidator = (value: number) =>
  value >= 1 && value <= 1440 ? null : "Between 1 and 1440 minutes";

const PRESET_ICONS: Record<string, typeof IconClock> = {
  Classic: IconClock,
  "Deep work": IconBrain,
  "Short bursts": IconBolt,
};

type NotificationState = NotificationPermission | "unsupported";

export function TimerSettingsDialog() {
  const opened = useIsTimerSettingsDialogOpened();
  const { close } = useTimerSettingsDialogHandlers();
  const { data: settings } = useTimerSettings();
  const { data: timer } = useTimer();
  const updateMutation = useUpdateTimerSettings();

  const soundEnabled = useTimerSoundSettingsStore((s) => s.enabled);
  const volume = useTimerSoundSettingsStore((s) => s.volume);
  const setSoundEnabled = useTimerSoundSettingsStore((s) => s.setEnabled);
  const setVolume = useTimerSoundSettingsStore((s) => s.setVolume);

  const [notifState, setNotifState] = useState<NotificationState>(
    canUseNotifications() ? Notification.permission : "unsupported",
  );

  // Mirrors the uncontrolled form so the session warning can react to edits.
  const [draft, setDraft] = useState(DEFAULT_TIMER_SETTINGS_FORM_VALUES);

  const form = useForm<TimerSettingsFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TIMER_SETTINGS_FORM_VALUES,
    onValuesChange: setDraft,
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

  const session = timer?.session ?? null;
  const endsSession =
    session !== null &&
    differsFromSnapshot(formToSettings(draft), session.settings);
  const discardsBlock = timer?.status === "running" || timer?.status === "paused";

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
        <Stack gap={6}>
          <Group gap={6}>
            <IconBolt size={14} />
            <Text size="sm" fw={500}>
              Quick presets
            </Text>
          </Group>
          <Group gap="xs">
            {TIMER_SETTINGS_PRESETS.map((preset) => {
              const Icon = PRESET_ICONS[preset.label];
              return (
                <Button
                  key={preset.label}
                  variant="default"
                  size="xs"
                  radius="xl"
                  leftSection={Icon ? <Icon size={14} /> : undefined}
                  onClick={() => form.setValues(preset.values)}
                >
                  {preset.label}
                </Button>
              );
            })}
          </Group>
        </Stack>

        <Divider label="Durations" labelPosition="left" />

        <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
          <NumberInput
            label="Focus (min)"
            leftSection={<IconBrain size={16} />}
            min={1}
            max={1440}
            clampBehavior="strict"
            allowDecimal={false}
            key={form.key("focusMinutes")}
            {...form.getInputProps("focusMinutes")}
          />
          <NumberInput
            label="Short break (min)"
            leftSection={<IconCoffee size={16} />}
            min={1}
            max={1440}
            clampBehavior="strict"
            allowDecimal={false}
            key={form.key("shortBreakMinutes")}
            {...form.getInputProps("shortBreakMinutes")}
          />
          <NumberInput
            label="Long break (min)"
            leftSection={<IconMoon size={16} />}
            min={1}
            max={1440}
            clampBehavior="strict"
            allowDecimal={false}
            key={form.key("longBreakMinutes")}
            {...form.getInputProps("longBreakMinutes")}
          />
          <NumberInput
            label={
              <Group gap={4} wrap="nowrap" component="span">
                <span>Long break interval</span>
                <Tooltip
                  label="Long break after N focus sessions"
                  withArrow
                  multiline
                  w={200}
                >
                  <IconInfoCircle
                    size={14}
                    style={{ cursor: "help", verticalAlign: "middle" }}
                  />
                </Tooltip>
              </Group>
            }
            leftSection={<IconRepeat size={16} />}
            min={1}
            max={50}
            clampBehavior="strict"
            allowDecimal={false}
            key={form.key("longBreakInterval")}
            {...form.getInputProps("longBreakInterval")}
          />
        </SimpleGrid>

        <Select
          label="Auto-end idle session"
          description="Paused or between blocks this long → the session resets."
          leftSection={<IconHourglass size={16} />}
          data={INACTIVITY_TIMEOUT_OPTIONS}
          allowDeselect={false}
          key={form.key("inactivityTimeout")}
          {...form.getInputProps("inactivityTimeout")}
        />

        {endsSession && (
          <Alert
            color="orange"
            variant="light"
            icon={<IconAlertTriangle size={18} />}
          >
            Saving ends your current session ({session.completedFocusBlocks}{" "}
            focus {session.completedFocusBlocks === 1 ? "block" : "blocks"}).
            {discardsBlock ? " The current block is discarded." : ""}
          </Alert>
        )}

        <Divider label="Sounds" labelPosition="left" />

        <Group gap="md" wrap="nowrap">
          <Switch
            label="Sound"
            checked={soundEnabled}
            onChange={(event) => setSoundEnabled(event.currentTarget.checked)}
          />
          {soundEnabled && (
            <Group gap="sm" wrap="nowrap" flex={1}>
              <IconVolume size={16} />
              <Slider
                flex={1}
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={setVolume}
                label={(value) => `${Math.round(value * 100)}%`}
              />
            </Group>
          )}
        </Group>

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
          Duration changes start a new session.
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color={endsSession ? "orange" : undefined}
            onClick={handleSave}
            loading={updateMutation.isPending}
          >
            {endsSession ? "Save & end session" : "Save"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
