import type { TimerSettings } from "@/timer/models/timer";

export interface TimerSettingsFormValues {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

export const DEFAULT_TIMER_SETTINGS_FORM_VALUES: TimerSettingsFormValues = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

export interface TimerSettingsPreset {
  label: string;
  values: TimerSettingsFormValues;
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
  };
}

export function formToSettings(values: TimerSettingsFormValues): TimerSettings {
  return {
    focusDurationSeconds: values.focusMinutes * 60,
    shortBreakDurationSeconds: values.shortBreakMinutes * 60,
    longBreakDurationSeconds: values.longBreakMinutes * 60,
    longBreakInterval: values.longBreakInterval,
  };
}
