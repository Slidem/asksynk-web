# 02 — Data layer: models, APIs, queries, command mutation

## Models — `src/timer/models/timer.ts`

Replace with API doc §10 types:

- `TimerStatus` (drop `stopped`), `TimerMode` (was `SessionType`), `TimerCommand`, `TimerTrigger`, `SessionEndReason`
- `TimerCommandRequest` (replaces `PatchTimerInput`)
- `TimerSettingsSnapshot`, `TimerSettings` (+ `inactivityTimeoutSeconds: number | null`)
- `AllowedCommand`, `FocusSession`, `Timer`, `TimerTransition`, `TimerTransitions`
- `TimerCompletedEvent` (new shape), `TimerSessionEndedEvent`

Keep / rename:

- `sessionDurationSeconds()` → `durationFor(s: TimerSettingsSnapshot, mode)`
- `sessionTypeLabel()` → `modeLabel(mode: TimerMode | null)`
- `DEFAULT_TIMER_SETTINGS` + `inactivityTimeoutSeconds: 3600` (or delete if unused)

Delete: `TimerSuggestion`, `PatchTimerInput`, `SessionType`.

`src/messages/socket/messageSocket.ts` `ServerToClient`: add `"timer.session_ended": (payload: TimerSessionEndedEvent) => void`.

## APIs — `src/timer/apis/`

| File | Change |
| --- | --- |
| `patchTimer.ts` → `sendTimerCommand.ts` | `sendTimerCommand(input: TimerCommandRequest)` → `PATCH /timers`. On `!ok` throw `ApiError`. |
| `fetchTimerTransitions.ts` | new, `GET /timers/transitions` |
| `fetchTimerSuggestion.ts` | delete |
| `fetchTimer.ts`, `fetchTimerSettings.ts`, `updateTimerSettings.ts` | types only |

Errors — `src/lib/apiError.ts` (new, shared):

```ts
export class ApiError extends Error {
  constructor(public status: number, public code: string | undefined, message: string) { super(message); }
}
export async function toApiError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return new ApiError(response.status, typeof body?.error === "string" ? body.error : undefined, body?.message ?? fallback);
}
```

`sendTimerCommand`: `if (!response.ok) throw await toApiError(response, "Failed to update timer")`. Needed to tell 409 (expected race → silent) from real failures (→ toast).

## Query keys / queries — `src/timer/hooks/queries/`

Fix prefix collision (01-E):

```ts
timerQueryKey()            → ["timer", "current"]
timerSettingsQueryKey()    → ["timer", "settings"]
timerTransitionsQueryKey() → ["timer", "transitions"]   // new useTimerTransitionsQueryData.ts
```

- `useTimer`: `staleTime: Infinity`, `refetchOnWindowFocus: "always"`. (Fixes 01-A; focus refetch per API §8.1.)
- `useTimerTransitions` (new): `staleTime: Infinity`, `gcTime: Infinity`. Mounted once in engine so it's warm before first click.
- `useTimerSettings`: unchanged.
- Delete `useTimerSuggestion.ts`, `useTimerSuggestionQueryData.ts`.

## State machine utils — `src/timer/utils/timerMachine.ts` (new)

Pure fns, implement API §8.3. Used by optimistic updater + engine (local timeout).

```ts
export function findTransition(table, timer, command, mode?)        // copy API §10
export function applyTriggers(timer, settings, nowMs): Timer        // timeout, then inactivity
export function applyCommand(timer, table, settings, req, nowMs): Timer | null
// internal
function allowedCommandsFor(table, timer): AllowedCommand[]          // non-noop command rows, merge start modes, order = table.commands
function suggestedNextModeFor(timer): TimerMode                      // API §4 rule
```

`applyCommand` steps:

1. `t = applyTriggers(timer, settings, now)`
2. `row = findTransition(table.transitions, t, req.command, mode)`; none → `null` (don't optimistic-update; still send — server decides). `noop` → return `t`.
3. Apply effects:
   - `sessionEffect: create` → temp session (`id: "optimistic"`, `startedAt: now`, counters 0, `settings` = user settings minus timeout), countdown = `longBreakInterval`
   - `blockEffect: skip` → old mode `focus` ⇒ `completedFocusBlocks+1`, countdown `max(0,n-1)`; then `start`
   - `blockEffect: start` → running, mode, `blockDurationSeconds = durationFor(session.settings, mode)`, `remainingSeconds = d`, `completesAt = now+d`, `transitionedAt = lastActivityAt = now`; break → `shortBreaks/longBreaks+1`; `long_break` → countdown = interval
   - `pause` → paused, `remainingSeconds = max(0, ceil((completesAt-now)/1000))`, `completesAt: null`, `transitionedAt = lastActivityAt = now`
   - `resume` → running, `completesAt = now + remainingSeconds*1000`, `transitionedAt = lastActivityAt = now`
   - `blockEffect: abandon` / `to: idle` → `mode/blockDurationSeconds/remainingSeconds/completesAt/transitionedAt: null`
   - `sessionEffect: end` → `session: null`, `focusBlocksUntilLongBreak: null`
4. Recompute `allowedCommands`, `suggestedNextMode`.

`applyTriggers`:

- timeout: `running && now >= completesAt` → completed, `remainingSeconds: 0`, `completesAt: null`, `lastActivityAt = completesAt`; focus ⇒ counters. Recompute derived fields.
- inactivity: session && `!running` && `settings.inactivityTimeoutSeconds !== null` && `now − lastActivityAt > timeout*1000` → idle, no session.

No test runner in repo (no vitest) → manual verification only. See open questions.

## Command mutation — `src/timer/hooks/mutations/useTimerCommand.ts` (new)

Replaces `useStartTimer`, `usePauseTimer`, `useResumeTimer`, `useStopTimer`. One generic hook: optimistic logic is table-driven, so per-command hooks would just duplicate it.

Not using `useOptimisticMutation` (its rollback + always-invalidate on error, and unconditional success write, cause flicker with concurrent commands).

```ts
const timerCommandMutationKey = ["timer", "command"] as const;

export function useTimerCommand() {
  const queryClient = useQueryClient();
  const isLast = () => queryClient.isMutating({ mutationKey: timerCommandMutationKey }) === 1;

  return useMutation({
    mutationKey: timerCommandMutationKey,
    scope: { id: "timer" },               // serial PATCHes, onMutate still immediate (verify)
    mutationFn: sendTimerCommand,
    onMutate: async (input) => {
      if (input.command === "start") void requestNotificationPermission(); // user gesture
      playTimerSound(soundFor(input));     // instant feedback, not after round-trip
      await queryClient.cancelQueries({ queryKey: timerQueryKey() });
      const timer = queryClient.getQueryData<Timer>(timerQueryKey());
      const table = queryClient.getQueryData<TimerTransitions>(timerTransitionsQueryKey());
      const settings = queryClient.getQueryData<TimerSettings>(timerSettingsQueryKey());
      if (!timer || !table || !settings) return;
      const now = Date.now();
      const next = applyCommand(timer, table, settings, input, now);
      if (!next) return;
      useTimerRuntimeStore.getState().setNowMs(now);   // 01-B
      queryClient.setQueryData(timerQueryKey(), next);
    },
    onSuccess: (data) => {
      if (isLast()) queryClient.setQueryData(timerQueryKey(), data);  // don't clobber a newer optimistic state
    },
    onError: (error) => {
      if (!(error instanceof ApiError && error.status === 409)) {
        notifications.show({ color: "red", title: "Timer not updated", message: "Couldn't reach the server. Synced to latest state." });
      }
      if (isLast()) queryClient.invalidateQueries({ queryKey: timerQueryKey() }); // server truth
    },
  });
}
```

Notes:

- No rollback to `previousData` on error: rollback → refetch = two flips. Keep optimistic until refetch replaces it.
- Toast on every non-409 error (network, 400, 403, 5xx); 409 (`invalid_transition`, `concurrency_conflict`) = silent resync.
- Sound plays on click even if the command later fails (decided: accept).
- `soundFor`: start/skip → `"start"`, pause → `"pause"`, resume → `"resume"`, stop/reset → `"stop"`.
- `isMutating` counts the current mutation while its callbacks run → `=== 1` means "I'm last".
- Verify TanStack v5 runs `onMutate` before the scope wait (expected; if not, optimistic update lags until previous command settles — still correct).

## Controller — `src/timer/hooks/useTimerController.ts` (rewrite)

Single derivation from `allowedCommands` (the only source for which controls exist, API §8.2):

```ts
{
  timer, status, mode, session,
  suggestedNextMode,
  startModes: TimerMode[],          // from allowedCommands start.modes
  can: (command: TimerCommand) => boolean,
  start: (mode) => send({ command: "start", mode }),
  pause, resume, stop, reset,
}
```

No `isPending` (01-C). Delete `useNextSession.ts`, `utils/nextSession.ts`.

Preview duration (not active): `durationFor(session?.settings ?? settings, suggestedNextMode)`.
