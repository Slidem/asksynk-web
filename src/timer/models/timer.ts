export type TimerStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "stopped";

export type SessionType = "focus" | "short_break" | "long_break";

export interface Timer {
  id: string;
  userId: string;
  status: TimerStatus;
  sessionType: SessionType | null;
  sessionDurationSeconds: number;
  remainingSeconds: number;
  completesAt: string | null;
  completedFocusSessions: number;
  transitionedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimerSettings {
  focusDurationSeconds: number;
  shortBreakDurationSeconds: number;
  longBreakDurationSeconds: number;
  longBreakInterval: number;
}

export interface TimerSuggestion {
  suggestedSessionType: "short_break" | "long_break";
  completedFocusSessions: number;
  longBreakInterval: number;
}

export interface TimerCompletedEvent {
  userId: string;
  sessionType: SessionType;
  sessionDurationSeconds: number;
  completedFocusSessions: number;
  completedAt: string;
}

export type PatchTimerInput =
  | { status: "running"; sessionType: SessionType; durationSeconds: number }
  | { status: "running" }
  | { status: "paused" }
  | { status: "stopped" };

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusDurationSeconds: 1500,
  shortBreakDurationSeconds: 300,
  longBreakDurationSeconds: 900,
  longBreakInterval: 4,
};

export function sessionDurationSeconds(
  settings: TimerSettings,
  sessionType: SessionType,
): number {
  switch (sessionType) {
    case "focus":
      return settings.focusDurationSeconds;
    case "short_break":
      return settings.shortBreakDurationSeconds;
    case "long_break":
      return settings.longBreakDurationSeconds;
  }
}

export function sessionTypeLabel(sessionType: SessionType | null): string {
  switch (sessionType) {
    case "focus":
      return "Focus";
    case "short_break":
      return "Short break";
    case "long_break":
      return "Long break";
    default:
      return "Timer";
  }
}
