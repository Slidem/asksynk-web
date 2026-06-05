import { useTimer } from "@/timer/hooks/queries/useTimer";
import { useTimerSettings } from "@/timer/hooks/queries/useTimerSettings";
import { useTimerSuggestion } from "@/timer/hooks/queries/useTimerSuggestion";
import {
  resolveAlternateSession,
  resolveNextSession,
  type AlternateSession,
  type NextSession,
} from "@/timer/utils/nextSession";
import { useMemo } from "react";

export function useNextSession(): {
  next: NextSession | null;
  alternate: AlternateSession | null;
} {
  const { data: timer } = useTimer();
  const { data: settings } = useTimerSettings();
  const { data: suggestion } = useTimerSuggestion();

  return useMemo(() => {
    const next = resolveNextSession(timer, suggestion, settings);
    return {
      next,
      alternate: resolveAlternateSession(timer, next, suggestion, settings),
    };
  }, [timer, suggestion, settings]);
}
