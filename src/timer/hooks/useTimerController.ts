import { useTimer } from "@/timer/hooks/queries/useTimer";
import { useTimerSettings } from "@/timer/hooks/queries/useTimerSettings";
import { useTimerCommand } from "@/timer/hooks/mutations/useTimerCommand";
import {
  durationFor,
  type TimerCommand,
  type TimerMode,
} from "@/timer/models/timer";

/**
 * Timer controls derived only from the server's `allowedCommands`, so the UI
 * never offers a command the server would reject.
 */
export function useTimerController() {
  const { data: timer } = useTimer();
  const { data: settings } = useTimerSettings();
  const { mutate } = useTimerCommand();

  const status = timer?.status ?? "idle";
  const isActive = status === "running" || status === "paused";
  const allowed = timer?.allowedCommands ?? [];
  const startModes = allowed.find((c) => c.command === "start")?.modes ?? [];
  const suggested = timer?.suggestedNextMode ?? "focus";
  const pick = (modes: TimerMode[]) =>
    modes.includes(suggested) ? suggested : (modes[0] ?? null);

  // While active, `start` = skip to the opposite kind; otherwise a fresh start.
  const skipModes = isActive ? startModes : [];
  const nextModes = isActive ? [] : startModes;
  const skipTarget = pick(skipModes);
  const nextMode = pick(nextModes);

  const snapshot = timer?.session?.settings ?? settings;

  return {
    timer,
    status,
    isActive,
    session: timer?.session ?? null,
    skipTarget,
    otherSkipModes: skipModes.filter((m) => m !== skipTarget),
    nextMode,
    otherNextModes: nextModes.filter((m) => m !== nextMode),
    can: (command: TimerCommand) => allowed.some((c) => c.command === command),
    durationOf: (mode: TimerMode) =>
      snapshot ? durationFor(snapshot, mode) : null,
    start: (mode: TimerMode) => mutate({ command: "start", mode }),
    pause: () => mutate({ command: "pause" }),
    resume: () => mutate({ command: "resume" }),
    stop: () => mutate({ command: "stop" }),
    reset: () => mutate({ command: "reset" }),
  };
}
