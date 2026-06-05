import {
  sessionDurationSeconds,
  type SessionType,
  type Timer,
  type TimerSettings,
  type TimerSuggestion,
} from "@/timer/models/timer";

export interface NextSession {
  sessionType: SessionType;
  durationSeconds: number;
}

export interface AlternateSession extends NextSession {
  label: string;
}

/**
 * The session the timer previews + starts when it is NOT running:
 * completed focus → suggested break; completed break / idle → focus;
 * stopped → the same type again.
 */
export function resolveNextSession(
  timer: Timer | undefined,
  suggestion: TimerSuggestion | undefined,
  settings: TimerSettings | undefined,
): NextSession | null {
  if (!settings) return null;

  const make = (sessionType: SessionType): NextSession => ({
    sessionType,
    durationSeconds: sessionDurationSeconds(settings, sessionType),
  });

  const status = timer?.status ?? "idle";

  const last = timer?.sessionType ?? null;

  if (status === "completed") {
    return make(
      last === "focus"
        ? (suggestion?.suggestedSessionType ?? "short_break")
        : "focus",
    );
  }
  if (status === "stopped") {
    return make(last ?? "focus");
  }
  return make("focus");
}

/**
 * The opposite-category session (focus ↔ break) to the one currently shown:
 * while active → switch the running session; while previewing → the alternative
 * to `next`. focus → suggested break ("Take a break"); break → "Start focus".
 */
export function resolveAlternateSession(
  timer: Timer | undefined,
  next: NextSession | null,
  suggestion: TimerSuggestion | undefined,
  settings: TimerSettings | undefined,
): AlternateSession | null {
  if (!settings) return null;

  const status = timer?.status ?? "idle";
  const isActive = status === "running" || status === "paused";
  const primary = isActive
    ? (timer?.sessionType ?? null)
    : (next?.sessionType ?? null);
  if (!primary) return null;

  const make = (sessionType: SessionType, label: string): AlternateSession => ({
    sessionType,
    durationSeconds: sessionDurationSeconds(settings, sessionType),
    label,
  });

  return primary === "focus"
    ? make(suggestion?.suggestedSessionType ?? "short_break", "Take a break")
    : make("focus", "Start focus");
}
