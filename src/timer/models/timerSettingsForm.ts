import type {
  TimerSettings,
  TimerSettingsSnapshot,
} from "@/timer/models/timer";

export type InactivityTimeoutValue =
  | "never"
  | "3600"
  | "7200"
  | "14400"
  | "28800";

export const INACTIVITY_TIMEOUT_OPTIONS: {
  value: InactivityTimeoutValue;
  label: string;
}[] = [
  { value: "never", label: "Never" },
  { value: "3600", label: "1 hour" },
  { value: "7200", label: "2 hours" },
  { value: "14400", label: "4 hours" },
  { value: "28800", label: "8 hours" },
];

export interface TimerDurationFormValues {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

export interface TimerSettingsFormValues extends TimerDurationFormValues {
  inactivityTimeout: InactivityTimeoutValue;
}

export const DEFAULT_TIMER_SETTINGS_FORM_VALUES: TimerSettingsFormValues = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  inactivityTimeout: "3600",
};

export interface TimerSettingsPreset {
  label: string;
  values: TimerDurationFormValues;
}

export const TIMER_SETTINGS_PRESETS: readonly TimerSettingsPreset[] = [
  {
    label: "Classic",
    values: {
      focusMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      longBreakInterval: 4,
    },
  },
  {
    label: "Deep work",
    values: {
      focusMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 20,
      longBreakInterval: 4,
    },
  },
  {
    label: "Short bursts",
    values: {
      focusMinutes: 15,
      shortBreakMinutes: 3,
      longBreakMinutes: 10,
      longBreakInterval: 4,
    },
  },
] as const;

export function settingsToForm(
  settings: TimerSettings,
): TimerSettingsFormValues {
  return {
    focusMinutes: Math.round(settings.focusDurationSeconds / 60),
    shortBreakMinutes: Math.round(settings.shortBreakDurationSeconds / 60),
    longBreakMinutes: Math.round(settings.longBreakDurationSeconds / 60),
    longBreakInterval: settings.longBreakInterval,
    inactivityTimeout:
      settings.inactivityTimeoutSeconds === null
        ? "never"
        : (String(settings.inactivityTimeoutSeconds) as InactivityTimeoutValue),
  };
}

export function formToSettings(values: TimerSettingsFormValues): TimerSettings {
  return {
    focusDurationSeconds: values.focusMinutes * 60,
    shortBreakDurationSeconds: values.shortBreakMinutes * 60,
    longBreakDurationSeconds: values.longBreakMinutes * 60,
    longBreakInterval: values.longBreakInterval,
    inactivityTimeoutSeconds:
      values.inactivityTimeout === "never"
        ? null
        : Number(values.inactivityTimeout),
  };
}

/** Saving settings that differ from the session snapshot ends the session. */
export function differsFromSnapshot(
  settings: TimerSettingsSnapshot,
  snapshot: TimerSettingsSnapshot,
): boolean {
  return (
    settings.focusDurationSeconds !== snapshot.focusDurationSeconds ||
    settings.shortBreakDurationSeconds !== snapshot.shortBreakDurationSeconds ||
    settings.longBreakDurationSeconds !== snapshot.longBreakDurationSeconds ||
    settings.longBreakInterval !== snapshot.longBreakInterval
  );
}
