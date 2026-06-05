import { useTimer } from "@/timer/hooks/queries/useTimer";
import { useNextSession } from "@/timer/hooks/useNextSession";
import { usePauseTimer } from "@/timer/hooks/mutations/usePauseTimer";
import { useResumeTimer } from "@/timer/hooks/mutations/useResumeTimer";
import { useStartTimer } from "@/timer/hooks/mutations/useStartTimer";
import { useStopTimer } from "@/timer/hooks/mutations/useStopTimer";
import type { SessionType } from "@/timer/models/timer";

export function useTimerController() {
  const { data: timer } = useTimer();
  const { next, alternate } = useNextSession();
  const startMutation = useStartTimer();
  const resumeMutation = useResumeTimer();
  const pauseMutation = usePauseTimer();
  const stopMutation = useStopTimer();

  const status = timer?.status ?? "idle";
  const isActive = status === "running" || status === "paused";

  // Backend allows starting a new session while one is running, so `start`
  // doubles as the switch/start-next action.
  const start = (sessionType: SessionType, durationSeconds: number) =>
    startMutation.mutate({ sessionType, durationSeconds });

  return {
    timer,
    status,
    next,
    alternate,
    start,
    startNext: () => {
      if (next) start(next.sessionType, next.durationSeconds);
    },
    switchToAlternate: () => {
      if (alternate) start(alternate.sessionType, alternate.durationSeconds);
    },
    resume: () => resumeMutation.mutate(),
    pause: () => pauseMutation.mutate(),
    stop: () => stopMutation.mutate(),
    canResume: status === "paused",
    canPause: status === "running",
    canStop: isActive,
    canSwitch: isActive && alternate != null,
    canStartNext: next != null,
    isPending:
      startMutation.isPending ||
      resumeMutation.isPending ||
      pauseMutation.isPending ||
      stopMutation.isPending,
  };
}
