import {
  durationFor,
  type AllowedCommand,
  type Timer,
  type TimerCommand,
  type TimerCommandRequest,
  type TimerMode,
  type TimerSettings,
  type TimerSettingsSnapshot,
  type TimerTransition,
  type TimerTransitions,
} from "@/timer/models/timer";

/**
 * Client copy of the server state machine (driven by `GET /timers/transitions`),
 * used for optimistic updates and local 00:00. The server response always wins.
 */

const OPTIMISTIC_SESSION_ID = "optimistic";

const iso = (ms: number) => new Date(ms).toISOString();

function matchesState(row: TimerTransition, timer: Timer): boolean {
  return (
    row.from === timer.status &&
    (row.session === undefined ||
      (row.session === "attached") === (timer.session !== null)) &&
    (row.fromModes === undefined ||
      (timer.mode !== null && row.fromModes.includes(timer.mode)))
  );
}

export function findTransition(
  table: TimerTransition[],
  timer: Timer,
  command: TimerCommand,
  mode?: TimerMode,
): TimerTransition | undefined {
  return table.find(
    (row) =>
      matchesState(row, timer) &&
      row.on.command === command &&
      (row.on.modes === undefined ||
        (mode !== undefined && row.on.modes.includes(mode))),
  );
}

function allowedCommandsFor(
  table: TimerTransitions,
  timer: Timer,
): AllowedCommand[] {
  const result: AllowedCommand[] = [];
  for (const command of table.commands) {
    const rows = table.transitions.filter(
      (row) =>
        row.on.command === command && !row.noop && matchesState(row, timer),
    );
    if (rows.length === 0) continue;
    if (command === "start") {
      const modes = table.modes.filter((mode) =>
        rows.some((row) => row.on.modes?.includes(mode)),
      );
      if (modes.length > 0) result.push({ command, modes });
    } else {
      result.push({ command });
    }
  }
  return result;
}

function suggestedNextModeFor(timer: Timer): TimerMode {
  if (timer.status === "idle" || timer.mode !== "focus") return "focus";
  const countdown = timer.focusBlocksUntilLongBreak ?? 0;
  const reachesLongBreak =
    timer.status === "completed" ? countdown === 0 : countdown - 1 <= 0;
  return reachesLongBreak ? "long_break" : "short_break";
}

function withDerived(timer: Timer, table: TimerTransitions): Timer {
  return {
    ...timer,
    allowedCommands: allowedCommandsFor(table, timer),
    suggestedNextMode: suggestedNextModeFor(timer),
  };
}

function countFocusBlock(timer: Timer): Timer {
  if (!timer.session) return timer;
  return {
    ...timer,
    session: {
      ...timer.session,
      completedFocusBlocks: timer.session.completedFocusBlocks + 1,
    },
    focusBlocksUntilLongBreak:
      timer.focusBlocksUntilLongBreak === null
        ? null
        : Math.max(0, timer.focusBlocksUntilLongBreak - 1),
  };
}

function clearBlock(timer: Timer): Timer {
  return {
    ...timer,
    status: "idle",
    mode: null,
    blockDurationSeconds: null,
    remainingSeconds: null,
    completesAt: null,
    transitionedAt: null,
  };
}

function endSession(timer: Timer): Timer {
  return { ...timer, session: null, focusBlocksUntilLongBreak: null };
}

function startBlock(timer: Timer, mode: TimerMode, nowMs: number): Timer {
  if (!timer.session) return timer;
  const duration = durationFor(timer.session.settings, mode);
  let session = timer.session;
  let countdown = timer.focusBlocksUntilLongBreak;
  if (mode === "short_break") {
    session = { ...session, shortBreaks: session.shortBreaks + 1 };
  }
  if (mode === "long_break") {
    session = { ...session, longBreaks: session.longBreaks + 1 };
    countdown = session.settings.longBreakInterval;
  }
  return {
    ...timer,
    status: "running",
    mode,
    blockDurationSeconds: duration,
    remainingSeconds: duration,
    completesAt: iso(nowMs + duration * 1000),
    transitionedAt: iso(nowMs),
    session,
    focusBlocksUntilLongBreak: countdown,
  };
}

function snapshotOf(settings: TimerSettings): TimerSettingsSnapshot {
  return {
    focusDurationSeconds: settings.focusDurationSeconds,
    shortBreakDurationSeconds: settings.shortBreakDurationSeconds,
    longBreakDurationSeconds: settings.longBreakDurationSeconds,
    longBreakInterval: settings.longBreakInterval,
  };
}

/** Apply due automatic transitions (timeout, then inactivity). Same ref if none. */
export function applyTriggers(
  timer: Timer,
  table: TimerTransitions,
  settings: TimerSettings | undefined,
  nowMs: number,
): Timer {
  let next = timer;

  if (
    next.status === "running" &&
    next.completesAt &&
    nowMs >= Date.parse(next.completesAt)
  ) {
    next = {
      ...next,
      status: "completed",
      remainingSeconds: 0,
      completesAt: null,
      lastActivityAt: next.completesAt,
    };
    if (next.mode === "focus") next = countFocusBlock(next);
  }

  const timeoutSeconds = settings?.inactivityTimeoutSeconds ?? null;
  if (
    next.session &&
    next.status !== "running" &&
    timeoutSeconds !== null &&
    next.lastActivityAt &&
    nowMs - Date.parse(next.lastActivityAt) > timeoutSeconds * 1000
  ) {
    next = endSession(clearBlock(next));
  }

  return next === timer ? timer : withDerived(next, table);
}

/**
 * Predict the server result of a command. `null` = no matching row (or data
 * missing) — skip the optimistic update and let the server decide.
 */
export function applyCommand(
  timer: Timer,
  table: TimerTransitions,
  settings: TimerSettings | undefined,
  input: TimerCommandRequest,
  nowMs: number,
): Timer | null {
  const current = applyTriggers(timer, table, settings, nowMs);
  const mode = input.command === "start" ? input.mode : undefined;
  const row = findTransition(table.transitions, current, input.command, mode);
  if (!row) return null;
  if (row.noop) return current;

  let next: Timer = { ...current, lastActivityAt: iso(nowMs) };

  if (row.sessionEffect === "create") {
    if (!settings) return null;
    next = {
      ...next,
      session: {
        id: OPTIMISTIC_SESSION_ID,
        startedAt: iso(nowMs),
        completedFocusBlocks: 0,
        shortBreaks: 0,
        longBreaks: 0,
        settings: snapshotOf(settings),
      },
      focusBlocksUntilLongBreak: settings.longBreakInterval,
    };
  }

  if (row.blockEffect === "skip" && next.mode === "focus") {
    next = countFocusBlock(next);
  }

  if ((row.blockEffect === "start" || row.blockEffect === "skip") && mode) {
    next = startBlock(next, mode, nowMs);
  }

  if (input.command === "pause" && next.completesAt) {
    next = {
      ...next,
      status: "paused",
      remainingSeconds: Math.max(
        0,
        Math.ceil((Date.parse(next.completesAt) - nowMs) / 1000),
      ),
      completesAt: null,
      transitionedAt: iso(nowMs),
    };
  }

  if (input.command === "resume" && next.remainingSeconds !== null) {
    next = {
      ...next,
      status: "running",
      completesAt: iso(nowMs + next.remainingSeconds * 1000),
      transitionedAt: iso(nowMs),
    };
  }

  if (row.to === "idle") next = clearBlock(next);
  if (row.sessionEffect === "end") next = endSession(next);

  return withDerived(next, table);
}
