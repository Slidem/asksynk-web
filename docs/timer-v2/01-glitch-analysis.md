# 01 — Start glitch: root cause

Symptom: click start focus → UI flips running → previous state → running (short flash).

## A. Primary cause: refetch-on-mount GET races the PATCH

Facts in code:

- `src/main.tsx`: `new QueryClient()`, defaults → `staleTime: 0`, `refetchOnMount: true`, `refetchOnWindowFocus: true`.
- `useTimer()` (`src/timer/hooks/queries/useTimer.ts`) has no `staleTime` → data stale the instant it lands, incl. data written by `setQueryData`.
- TanStack refetches **per observer mount** when data is stale.
- `PomodoroTimer` swaps whole control subtrees on status: inactive → `StartNextControls` / `SessionTypePicker` / `SessionCompleteBanner`; active → `TimerControls`. Each calls `useTimerController()` → `useTimer()` + `useNextSession()` (`useTimer`, `useTimerSettings`, `useTimerSuggestion`). Same for `FloatingTimer` / `DashboardTimer` (ambient visibility flips on status too).

Sequence on start (from completed / stopped / idle):

```
t0  click → useStartTimer.mutate
t0  onMutate: cancelQueries(["timer"]) → setQueryData(optimistic running)
t1  render: TimerControls mounts → NEW useTimer/useTimerSettings/useTimerSuggestion observers
t1  data stale → GET /timers, GET /timers/settings, GET /timers/suggestion fire
    (cancelQueries in onMutate already ran — can't cancel these)
    ── PATCH /timers and GET /timers now in flight in parallel ──
t2  GET served before PATCH commit → returns OLD state (completed/stopped)
    → cache = old → UI flips back (StartNextControls, banner remount)
t3  PATCH resolves → onSuccess setQueryData(running) → UI running again
```

= the flash. Worse variant: GET read before commit but resolves **after** PATCH → cache stuck on old state until next refetch (focus/WS).

Same mechanism hits any status flip that mounts new observers (pause/resume less so: same `TimerControls` subtree stays mounted).

### Verify (please run)

1. DevTools → Network, filter `timers`. Click start. Expect `PATCH /timers` + `GET /timers` (+ `/settings`, `/suggestion`) fired together.
2. React Query Devtools: `["timer"]` shows a fetch right after the optimistic write.
3. Quick proof: add `staleTime: Infinity` to `useTimer` → flash gone.

## B. Stale `nowMs` on first running frame (resume flash)

- `useTimerEngine` updates `nowMs` in a `useEffect` → runs **after paint**.
- While not running, `nowMs` frozen at last status change (can be minutes old).
- First running frame: `remaining = completesAt − staleNow` → huge → clamped to `total` in `usePomodoroPhase`.
- Start: clamp = correct value by luck. **Resume**: shows full duration (e.g. 25:00, bar 0%) for one frame, then snaps to real remaining.
- Fix: optimistic updater sets `nowMs` with same `now`; engine starts tick in `useLayoutEffect` (covers refetch/WS paths).

## C. Spinners on every button while pending

`TimerControls` passes `loading={isPending}` to all buttons → pause/resume shows spinners on pause, stop, switch at once, then they vanish. With optimistic updates, loading state is noise.

## D. Server-time correction jump

Optimistic `completesAt = clientNow + d`; server's = `serverNow + d`. Response replaces it → digits jump by latency/skew (upward hidden by clamp, downward visible). Usually ≤1 s. Accept (see 03 for optional skew note).

## E. Prefix key collisions (waste, not visual)

`timerQueryKey = ["timer"]` is a prefix of `["timer","settings"]` / `["timer","suggestion"]` → every `invalidateQueries(["timer"])` (WS completed, socket connect) and `cancelQueries(["timer"])` hit settings too.

## F. Ending-soon sound can double-fire

`endingSoonFiredRef` re-arms on every `completesAt` change. Resume in last 60 s: optimistic `completesAt` → fire → server `completesAt` (differs by ms) → re-arm → fire again. Fix: re-arm when tick sees `!isEndingSoon` instead of on `completesAt` change.

## Fix summary (implemented in 02/03)

| Cause          | Fix                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| A              | `useTimer`: `staleTime: Infinity`, `refetchOnWindowFocus: "always"`. Freshness comes from command responses, WS, socket connect, focus. |
| A              | Guard WS/connect refetches while a command is in flight (`isMutating`).                                                                 |
| A (concurrent) | Commands in one mutation `scope` (serial); only last pending mutation writes response to cache.                                         |
| B              | `setNowMs(now)` in optimistic updater; `useLayoutEffect` for tick start.                                                                |
| C              | No `loading` on timer controls.                                                                                                         |
| E              | Keys: `["timer","current"]`, `["timer","settings"]`, `["timer","transitions"]`.                                                         |
| F              | Re-arm ending-soon on leaving the window, not on `completesAt` change.                                                                  |
