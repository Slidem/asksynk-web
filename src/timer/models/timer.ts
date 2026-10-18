export type TimerStatus = "idle" | "running" | "paused" | "completed";
export type TimerMode = "focus" | "short_break" | "long_break";
export type TimerCommand = "start" | "pause" | "resume" | "stop" | "reset";
export type TimerTrigger = "timeout" | "inactivity" | "settings_changed";
export type SessionEndReason = "manual_reset" | "inactivity" | "settings_changed";

export type TimerCommandRequest =
  | { command: "start"; mode: TimerMode }
  | { command: "pause" | "resume" | "stop" | "reset" };

export interface TimerSettingsSnapshot {
  focusDurationSeconds: number;
  shortBreakDurationSeconds: number;
  longBreakDurationSeconds: number;
  longBreakInterval: number;
}

export interface TimerSettings extends TimerSettingsSnapshot {
  /** null = never auto-end; else 3600..86400. */
  inactivityTimeoutSeconds: number | null;
}

export interface AllowedCommand {
  command: TimerCommand;
  /** start only */
  modes?: TimerMode[];
}

export interface FocusSession {
  id: string;
  startedAt: string;
  completedFocusBlocks: number;
  shortBreaks: number;
  longBreaks: number;
  settings: TimerSettingsSnapshot;
}

export interface Timer {
  id: string;
  userId: string;
  status: TimerStatus;
  mode: TimerMode | null;
  blockDurationSeconds: number | null;
  remainingSeconds: number | null;
  completesAt: string | null;
  transitionedAt: string | null;
  lastActivityAt: string | null;
  suggestedNextMode: TimerMode;
  allowedCommands: AllowedCommand[];
  focusBlocksUntilLongBreak: number | null;
  session: FocusSession | null;
  createdAt: string;
  updatedAt: string;
}

export interface TimerTransition {
  from: TimerStatus;
  session?: "none" | "attached";
  fromModes?: TimerMode[];
  on: { command?: TimerCommand; modes?: TimerMode[]; trigger?: TimerTrigger };
  to: TimerStatus;
  sessionEffect: "create" | "keep" | "end";
  blockEffect: "start" | "skip" | "abandon" | "complete" | "none";
  noop?: true;
}

export interface TimerTransitions {
  statuses: TimerStatus[];
  modes: TimerMode[];
  commands: TimerCommand[];
  triggers: TimerTrigger[];
  triggerOrder: TimerTrigger[];
  transitions: TimerTransition[];
}

export interface TimerCompletedEvent {
  userId: string;
  sessionId: string;
  eventType: "completed";
  mode: TimerMode;
  durationSeconds: number;
  remainingSeconds: number;
  reason: null;
  occurredAt: string;
}

export interface TimerSessionEndedEvent {
  userId: string;
  sessionId: string;
  reason: SessionEndReason;
  finishedAt: string;
}

export function durationFor(
  settings: TimerSettingsSnapshot,
  mode: TimerMode,
): number {
  switch (mode) {
    case "focus":
      return settings.focusDurationSeconds;
    case "short_break":
      return settings.shortBreakDurationSeconds;
    case "long_break":
      return settings.longBreakDurationSeconds;
  }
}

export function modeLabel(mode: TimerMode | null): string {
  switch (mode) {
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
