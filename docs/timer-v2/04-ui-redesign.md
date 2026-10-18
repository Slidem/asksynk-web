# 04 — UI redesign

## Problems today

1. **Preview looks like a countdown.** Not active → big digits show next block's duration in normal color ("Next · Focus 25:00") — reads like a paused timer.
2. **Two different control sets for "not running".** `StartNextControls` (play + alternate) vs, after 5 min, `SessionTypePicker` (3 buttons). Same state, different UI depending on age.
3. **Icon-only primary actions.** Play / stop have no label; play doesn't say *what* starts (only aria-label). Floating widget: one play icon, no context.
4. **Hidden semantics.** "Take a break" while running = skip (focus counted as done). Stop = discard (not counted). Neither is explained.
5. **No session context.** No block count, no long-break cadence, no way to end a session, no hint that idle sessions auto-end.
6. **Spinners on every button** while a request is pending (01-C).
7. **New API conflicts.** Picker offers break starts with no session (→409); duration sent from client (ignored now); `stopped` status gone.

## Principles

- Controls rendered **only from `allowedCommands`** (+ local 00:00 → `completed` set). Never a button the server would reject.
- **One primary action**, always labelled with the mode it acts on: "Start focus", "Pause", "Resume", "Start short break".
- Secondary = **skip** (explicit label + tooltip about counting). Destructive/rare (stop block, end session) in a **⋯ menu** with a one-line description each.
- Preview digits **dimmed** with "Up next" label; live digits use phase color.
- Same layout across states, only the content changes (no subtree swaps → also fewer remounts).

## States → controls

| State | Label line | Digits | Primary | Secondary | ⋯ menu |
| --- | --- | --- | --- | --- | --- |
| idle, no session | `Up next · Focus` | focus duration, dimmed | **Start focus** | — | — |
| idle, session (after stop) | `Up next · <suggested>` | suggested duration, dimmed | **Start <suggested>** | other start modes as subtle buttons ("Long break · 15m") | End session |
| running focus | `Focus · ends 10:25` | live | **Pause** | **Skip to <suggested break>** (+ other break in menu) | Stop block · End session |
| running break | `Short break · ends 10:30` | live | **Pause** | **Skip to focus** | Stop block · End session |
| paused | `<mode> · Paused` | frozen, gray | **Resume** | same skip as running | Stop block · End session |
| completed | banner "Focus complete · 25 min" + `Up next · <suggested>` | suggested duration, dimmed | **Start <suggested>** | other start modes (incl. "Skip break → Focus") | End session |

Notes:

- `suggested` = `suggestedNextMode`. Running focus: skip target = suggested break; the other break as menu item "Skip to long break".
- `stop` in `completed` (→ idle w/ session) not exposed: same as just picking next block later. YAGNI.
- Tooltips: Skip from focus → "Counts this focus block as done". Skip from break → "Ends break now". Stop block → "Discard this block — not counted. Session continues." End session → "Reset counters. Next start begins a new session."
- No `loading` on any timer control.
- **End session confirms** via `modals.openConfirmModal` (`@mantine/modals`): title "End session?", body "Resets this session's counters (N focus blocks). The current block is discarded." (block part only when running/paused), confirm red "End session", cancel "Keep going". Stop block: no confirm (session survives).

## Session strip (under controls, main page only)

```
Session · since 9:30 · 3 focus blocks · ●●●○ long break next
```

- dots = `session.settings.longBreakInterval`; filled = `interval − focusBlocksUntilLongBreak`
- `focusBlocksUntilLongBreak === 0` → "long break next"; else "long break in N"
- not running + `inactivityTimeoutSeconds !== null` → append "· auto-ends 11:41 if idle" (`lastActivityAt + timeout`)
- no session → "No active session · start focus to begin"

## Mockups

Main page (`/timer`), running focus:

```
┌──────────────────────────────────────────────┐
│               FOCUS · ENDS 10:25             │
│                                              │
│                   24:12                      │
│   ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│                                              │
│   [ ⏸  Pause ]   [ ⏭ Skip to break ]   [⋯]   │
│                                              │
│   Session · since 9:30 · 1 focus · ●○○○      │
└──────────────────────────────────────────────┘
 ⋯ → Skip to long break
     Stop block        Discard — not counted
     ─────
     End session       Reset counters
```

Completed:

```
┌──────────────────────────────────────────────┐
│          ✓ Focus complete · 25 min           │
│              UP NEXT · SHORT BREAK           │
│                   05:00   (dimmed)           │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│                                              │
│  [ ▶ Start short break ]  Long break · 15m   │
│                           Focus · 25m   [⋯]  │
│   Session · since 9:30 · 2 focus · ●●○○      │
└──────────────────────────────────────────────┘
```

Idle, no session:

```
│              UP NEXT · FOCUS                 │
│                   25:00   (dimmed)           │
│             [ ▶ Start focus ]                │
│   No active session · start focus to begin   │
```

Floating / Dashboard (compact):

```
┌ FOCUS          24:12  – ┐
│ ███████░░░░░░░░░░░░░░░  │
│     [⏸]   [⏭]   [⋯]     │   icons + tooltips ("Pause", "Skip to short break")
└─────────────────────────┘
not active: [▶ Short break] (small labelled button) + [⋯] (other modes, end session)
```

Sidebar ring: unchanged.

## Components (`src/timer/components/`)

| Component | Role |
| --- | --- |
| `TimerActions` | layout: primary + secondary + menu; `compact` prop for floating/dashboard. Replaces `TimerControls`, `StartNextControls`, `StartNextButton`, `SessionTypePicker` (delete all 4). |
| `TimerPrimaryAction` | Start <suggested> / Pause / Resume |
| `TimerSkipAction` | skip button (running/paused); hidden otherwise |
| `TimerStartOptions` | non-suggested start modes when not active (non-compact only; compact → in menu) |
| `TimerMoreMenu` | Mantine `Menu`: other skip target, Stop block, End session (+ start modes in compact) |
| `TimerSessionSummary` | session strip |
| `SessionCompleteBanner` | update fields (`mode`, `blockDurationSeconds`) |

All read `useTimerController()`; no prop drilling beyond size/compact.

## View hook — `useTimerView` / `usePomodoroPhase`

- `isActive` = running | paused (unchanged meaning)
- `displaySeconds`: running → `completesAt − nowMs`; paused → `remainingSeconds`; else preview duration (02)
- `preview: boolean` (not active) → digits/bar dimmed
- `label`: active → `modeLabel(mode)`; else `modeLabel(suggestedNextMode)` with "Up next"
- `endsAt`: running → formatted `completesAt`
- total for fraction: `blockDurationSeconds`

## Visibility (`useTimerIdle`, `useAmbientTimerVisible`)

- `useTimerIdle`: use `lastActivityAt` instead of `transitionedAt` (null when idle now). Same 5-min rule.
- Ambient visible: `session !== null && !idle` (running/paused always have a session). Hides after session ends or 5 min untouched.
- `PomodoroTimer`: drop the `view.idle ? SessionTypePicker` branch — controls always from `TimerActions`.
- `DashboardTimer`: keep `if (view.idle) return null`.
