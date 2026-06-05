import { sessionTypeLabel, type Timer } from "@/timer/models/timer";
import { useTimerRuntimeStore } from "@/timer/store/timerRuntimeStore";
import { phaseToColor, type PomodoroPhase } from "@/timer/utils/phaseColor";
import { useMemo } from "react";

export interface PomodoroPhaseInfo {
  phase: PomodoroPhase;
  /** Seconds left in the current session (frozen when paused). */
  remainingSeconds: number;
  /** Elapsed progress 0..1 (bar fills as the session advances). */
  fraction: number;
  color: string;
  label: string;
}

const ENDING_SOON_SECONDS = 60;
const ENDING_SOON_FRACTION = 0.1;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function compute(
  timer: Timer | undefined,
  nowMs: number,
): Pick<PomodoroPhaseInfo, "phase" | "remainingSeconds" | "fraction"> {
  if (!timer) return { phase: "idle", remainingSeconds: 0, fraction: 0 };

  const total = timer.sessionDurationSeconds || 0;

  if (timer.status === "running" && timer.completesAt) {
    const completesAtMs = new Date(timer.completesAt).getTime();
    const rawRemaining = Math.max(0, (completesAtMs - nowMs) / 1000);
    const remaining = total ? Math.min(rawRemaining, total) : rawRemaining;
    const remainingFraction = total ? remaining / total : 0;
    const phase: PomodoroPhase =
      remaining <= ENDING_SOON_SECONDS ||
      (total > 0 && remainingFraction <= ENDING_SOON_FRACTION)
        ? "ending-soon"
        : "active";
    return {
      phase,
      remainingSeconds: remaining,
      fraction: total ? clamp01(1 - remainingFraction) : 0,
    };
  }

  if (timer.status === "paused") {
    const remaining = timer.remainingSeconds;
    return {
      phase: "paused",
      remainingSeconds: remaining,
      fraction: total ? clamp01(1 - remaining / total) : 0,
    };
  }

  if (timer.status === "completed") {
    return { phase: "completed", remainingSeconds: 0, fraction: 1 };
  }

  // idle | stopped
  return {
    phase: "idle",
    remainingSeconds: timer.remainingSeconds ?? 0,
    fraction: 0,
  };
}

export function usePomodoroPhase(timer: Timer | undefined): PomodoroPhaseInfo {
  const nowMs = useTimerRuntimeStore((s) => s.nowMs);

  return useMemo(() => {
    const base = compute(timer, nowMs);
    return {
      ...base,
      color: phaseToColor(base.phase),
      label: sessionTypeLabel(timer?.sessionType ?? null),
    };
  }, [timer, nowMs]);
}
