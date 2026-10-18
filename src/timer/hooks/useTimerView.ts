import { useTimer } from "@/timer/hooks/queries/useTimer";
import { useTimerSettings } from "@/timer/hooks/queries/useTimerSettings";
import { usePomodoroPhase } from "@/timer/hooks/usePomodoroPhase";
import { useTimerIdle } from "@/timer/hooks/useTimerIdle";
import {
  durationFor,
  modeLabel,
  type TimerStatus,
} from "@/timer/models/timer";

const PREVIEW_COLOR = "var(--mantine-color-dimmed)";

export interface TimerView {
  status: TimerStatus;
  isActive: boolean;
  /** Not active and last activity > 5 min ago — stale, hide ambient surfaces. */
  idle: boolean;
  /** Active: remaining seconds. Otherwise: the suggested next block's duration. */
  displaySeconds: number;

  fraction: number;
  /** Phase color while active; dimmed while previewing the next block. */
  color: string;
  pulse: boolean;
  /** Active: current mode label. Otherwise: the suggested next mode label. */
  label: string;
  /** Running only: when the block ends. */
  completesAt: Date | null;
}

/** Read-only display state shared by all timer surfaces. */
export function useTimerView(): TimerView {
  const { data: timer } = useTimer();
  const { data: settings } = useTimerSettings();
  const phase = usePomodoroPhase(timer);
  const idle = useTimerIdle();

  const status = timer?.status ?? "idle";
  const isActive = status === "running" || status === "paused";
  const nextMode = timer?.suggestedNextMode ?? "focus";
  const snapshot = timer?.session?.settings ?? settings;

  return {
    status,
    isActive,
    idle,
    displaySeconds: isActive
      ? phase.remainingSeconds
      : snapshot
        ? durationFor(snapshot, nextMode)
        : 0,
    fraction: isActive ? phase.fraction : 0,
    color: isActive ? phase.color : PREVIEW_COLOR,
    pulse: isActive && phase.phase === "ending-soon",
    label: modeLabel(isActive ? (timer?.mode ?? null) : nextMode),
    completesAt:
      status === "running" && timer?.completesAt
        ? new Date(timer.completesAt)
        : null,
  };
}
