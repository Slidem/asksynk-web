import { useTimer } from "@/timer/hooks/queries/useTimer";
import { useNextSession } from "@/timer/hooks/useNextSession";
import { usePomodoroPhase } from "@/timer/hooks/usePomodoroPhase";
import { useTimerIdle } from "@/timer/hooks/useTimerIdle";
import { sessionTypeLabel, type TimerStatus } from "@/timer/models/timer";

export interface TimerView {
  status: TimerStatus;
  isActive: boolean;
  /** Not active and last transition > 5 min ago — stale, fall back to a fresh start. */
  idle: boolean;
  /** Active: remaining seconds. Otherwise: the next session's full duration. */
  displaySeconds: number;

  fraction: number;
  /** Phase color while active; undefined (neutral) while previewing. */
  color: string | undefined;
  pulse: boolean;
  /** Active: current session label. Otherwise: the next session label. */
  label: string;
}

/** Read-only display state shared by all timer surfaces. */
export function useTimerView(): TimerView {
  const { data: timer } = useTimer();
  const phase = usePomodoroPhase(timer);
  const { next } = useNextSession();
  const idle = useTimerIdle();

  const status = timer?.status ?? "idle";
  const isActive = status === "running" || status === "paused";

  return {
    status,
    isActive,
    idle,
    displaySeconds: isActive
      ? phase.remainingSeconds
      : (next?.durationSeconds ?? 0),
    fraction: isActive ? phase.fraction : 0,
    color: isActive ? phase.color : undefined,
    pulse: isActive && phase.phase === "ending-soon",
    label: sessionTypeLabel(
      isActive ? (timer?.sessionType ?? null) : (next?.sessionType ?? null),
    ),
  };
}
