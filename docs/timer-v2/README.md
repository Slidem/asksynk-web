# Timer v2 — migration + UX plan

Backend change: API doc 2026-10-18 (commands, sessions, transition table). Breaking for all timer endpoints.

| Doc | Content |
| --- | --- |
| [01-glitch-analysis](01-glitch-analysis.md) | Root cause of start flash + other glitches |
| [02-data-layer](02-data-layer.md) | Models, APIs, query keys, state machine utils, `useTimerCommand`, controller |
| [03-engine-and-sync](03-engine-and-sync.md) | Refetch policy, WS events, tick, local 00:00 |
| [04-ui-redesign](04-ui-redesign.md) | Control model per state, mockups, components |
| [05-settings](05-settings.md) | Inactivity timeout, session-ending warning |

## Implementation order

0. Install `@mantine/modals` (user runs `pnpm add @mantine/modals`), wrap app in `ModalsProvider` next to `MantineProvider`.
1. **Quick fix on current code (optional, proves 01-A):** `staleTime: Infinity` + `refetchOnWindowFocus: "always"` on `useTimer`. Verify flash gone.
2. Data layer (02): models → apis → keys/queries → `timerMachine.ts` → `useTimerCommand` → controller. App won't compile until 3–4 done.
3. Engine (03).
4. UI (04): view hook → new action components → wire `PomodoroTimer`, `FloatingTimer`, `DashboardTimer` → delete old components.
5. Settings (05).
6. Manual verification (below).

## File changes

New:

- `src/lib/apiError.ts` (`ApiError` with `status`, `code`)
- `src/timer/apis/sendTimerCommand.ts`, `src/timer/apis/fetchTimerTransitions.ts`
- `src/timer/hooks/queries/useTimerTransitions.ts`, `useTimerTransitionsQueryData.ts`
- `src/timer/hooks/mutations/useTimerCommand.ts`
- `src/timer/utils/timerMachine.ts`, `src/timer/utils/refreshTimer.ts`
- `src/timer/components/TimerActions.tsx`, `TimerPrimaryAction.tsx`, `TimerSkipAction.tsx`, `TimerStartOptions.tsx`, `TimerMoreMenu.tsx`, `TimerSessionSummary.tsx`

Modified:

- `models/timer.ts`, `models/timerSettingsForm.ts`
- `apis/fetchTimer.ts`, `apis/fetchTimerSettings.ts`, `apis/updateTimerSettings.ts` (types)
- `hooks/queries/useTimer.ts`, `useTimerQueryData.ts`
- `hooks/mutations/useUpdateTimerSettings.ts`
- `hooks/useTimerController.ts`, `useTimerEngine.ts`, `useTimerView.ts`, `usePomodoroPhase.ts`, `useTimerIdle.ts`, `useAmbientTimerVisible.ts`
- `components/PomodoroTimer.tsx`, `FloatingTimer.tsx`, `DashboardTimer.tsx`, `SessionCompleteBanner.tsx`, `TimerSettingsDialog.tsx`
- `src/messages/socket/messageSocket.ts` (event types)
- app root provider file (`ModalsProvider`)
- `package.json` (`@mantine/modals`)

Deleted:

- `apis/fetchTimerSuggestion.ts`, `apis/patchTimer.ts`
- `hooks/queries/useTimerSuggestion.ts`, `useTimerSuggestionQueryData.ts`
- `hooks/mutations/useStartTimer.ts`, `usePauseTimer.ts`, `useResumeTimer.ts`, `useStopTimer.ts`
- `hooks/useNextSession.ts`, `utils/nextSession.ts`
- `components/TimerControls.tsx`, `StartNextControls.tsx`, `StartNextButton.tsx`, `SessionTypePicker.tsx`

## Manual verification checklist

- Start focus from fresh / completed / stopped: no flash; Network shows only `PATCH /timers` (no parallel `GET`).
- Resume after a long pause: no one-frame full-duration flash.
- Rapid pause/resume clicks: final state correct, no flip-flop; PATCHes serialized.
- Skip focus → break: counter +1, cadence dots advance; skip break → focus: no count.
- Stop block: idle, session kept, all 3 modes offered. End session: no session, only "Start focus".
- Let a block hit 00:00: pause disappears at 00:00, completion toast/sound once (WS).
- Ending-soon sound once, incl. resume inside last minute.
- Two tabs: reset in A → B gets `timer.session_ended`, goes idle. Start in A → B updates on focus.
- Settings: change only inactivity → session kept. Change duration with open session → warning shown, session ends after save, toast.
- Pause > inactivity timeout (or set 1h, wait for sweep) → session ends, toast.
- Force a 409 (two tabs: pause in A, resume stale B twice) → B resyncs, no toast, no stuck state.
- Kill backend, click pause → error toast, state resyncs when back.
- End session → confirm modal; cancel keeps session.

## Decisions (2026-10-18)

1. Docs live in `docs/timer-v2/`.
2. Single `useTimerCommand` hook.
3. Sounds play on click (optimistic, in `onMutate`).
4. Non-409 command failures → error toast + refetch. 409 → silent refetch.
5. "End session" confirmed via `@mantine/modals` `openConfirmModal` (install + `ModalsProvider`).
6. `stop` not offered in `completed`.
7. Floating timer keeps 5-min hide rule.
8. Inactivity options: Never / 1h / 2h / 4h / 8h (no 24h).
9. No tests yet.
10. Skip to the other break lives in ⋯ menu.
