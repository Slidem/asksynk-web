# 03 — Engine & sync (`src/timer/hooks/useTimerEngine.ts`)

## Freshness policy

| Source | Action |
| --- | --- |
| Command response | write to cache (last pending only, see 02) |
| `timer.completed` WS | sound + toast + desktop notif, then refresh |
| `timer.session_ended` WS | toast (not for `manual_reset`), then refresh |
| socket `connect` | refresh |
| window focus | `refetchOnWindowFocus: "always"` on `useTimer` |
| `PUT /timers/settings` success | refresh |
| component mount | **nothing** (`staleTime: Infinity`) |

`refresh` = `invalidateQueries({ queryKey: timerQueryKey() })` **only if no command in flight** (`isMutating({ mutationKey: timerCommandMutationKey }) === 0`). In-flight command response already carries server state after triggers. Put this guard in one helper, e.g. `src/timer/utils/refreshTimer.ts` → `refreshTimer(queryClient)`.

WS events also go to the device that caused them (API §6). E.g. `reset` → `timer.session_ended` arrives while/after PATCH → guard skips or refetch returns same state → no flip.

## Tick

- Start tick in `useLayoutEffect` (01-B) — `nowMs` updated before paint on any → running transition (optimistic, refetch, other device).
- Tick fields: `blockDurationSeconds` (was `sessionDurationSeconds`).
- Ending-soon: `firedRef = false` whenever tick sees `!isEndingSoon`; fire once when entering window (01-F). Drop the `[completesAt]` re-arm effect.

## Local 00:00 (API §8.2)

When tick sees `running && now >= completesAt`, once per block:

```ts
queryClient.setQueryData(timerQueryKey(), (t) => t && applyTriggers(t, settings, now));
```

- Controls switch to the `completed` set immediately (no pause offered → no 409).
- Do **not** refetch here: client clock may be ahead → server still `running` → flip back. Wait for `timer.completed` WS → refresh → same state (structural sharing = no re-render).
- Completion sound/toast stay WS-driven (single source, no dedupe needed).

## Inactivity

No client timer. Covered by: server sweep (≤5 min) → `timer.session_ended`; focus refetch; `applyTriggers` inside optimistic commands (avoids optimistic resume of a dead session).

## WS handlers

```ts
handleCompleted(p: TimerCompletedEvent)   // p.mode (was sessionType)
  title = `${modeLabel(p.mode)} complete`; message by mode; sound; notification; desktop notif if hidden
  refreshTimer(queryClient)

handleSessionEnded(p: TimerSessionEndedEvent)
  reason inactivity       → toast "Session ended after inactivity"
  reason settings_changed → toast "Session reset — timer settings changed"
  manual_reset            → no toast
  refreshTimer(queryClient)
```

No more suggestion invalidation.

## Transitions warm-up

Engine calls `useTimerTransitions()` so the table is cached before the first command.

## Skew (optional, skip for now)

API: server clock ≈ `completesAt − remainingSeconds` (running). 1 s precision → not worth it now; jump on response ≤ ~1 s (01-D).
