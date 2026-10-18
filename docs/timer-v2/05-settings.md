# 05 — Settings dialog (`TimerSettingsDialog.tsx`, `timerSettingsForm.ts`)

## Form model

`TimerSettingsFormValues` + `inactivityTimeout: string` — Select value, `"never" | "3600" | "7200" | "14400" | "28800"` (API allows up to 24 h; UI stops at 8 h).

- `settingsToForm`: `null` → `"never"`, number → `String(n)`. Options fixed; only this UI writes the value, so off-list values not expected.
- `formToSettings`: `"never"` → `null`, else `Number(v)`. **Key always present** (PUT 400 otherwise).
- Presets don't touch `inactivityTimeout`.
- Minute validators: 1–1440 already = API 1–86400 s. OK.

## UI

New row under Durations:

```
Auto-end session after   [ 1 hour ▾ ]     (Never · 1h · 2h · 4h · 8h)
  "Idle session (paused or between blocks) resets after this."
```

Remove the `useTimerSuggestion` line ("Next break … x/y focus sessions") — endpoint gone; session strip on main page covers it.

## Session-ending warning

PUT ends the open session when any of the 4 duration/interval fields differ from `session.settings` (API §5).

- Read `timer.session` via `useTimer()`.
- `onValuesChange` (or `form.watch` on the 4 fields) → `endsSession = session && differs(formToSettings(values), session.settings)` → local state.
- When true show Mantine `Alert` (orange): "Saving ends your current session (3 focus blocks). The running block is discarded."
- Save button label → "Save & end session" when true.
- Replace footer copy "Changes apply to your next session." → "Duration changes start a new session."

## Mutation — `useUpdateTimerSettings`

- Types only + on success: `refreshTimer(queryClient)` (03) — timer may now be idle/no session. `timer.session_ended` push also arrives; guard/dedupe via structural sharing.
- Optimistic settings write stays.
- Optional nicety (skip unless cheap): if `endsSession`, also optimistically set timer → idle no session. YAGNI → rely on refresh.
