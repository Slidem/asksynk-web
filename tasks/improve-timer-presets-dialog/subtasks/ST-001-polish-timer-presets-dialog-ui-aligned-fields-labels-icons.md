---
id: ST-001
task: improve-timer-presets-dialog
title: Polish timer presets dialog UI (aligned fields, labels, icons)
status: done
source: overview
depends_on: []
owns:
  - src/timer/components/TimerSettingsDialog.tsx
branch: feat/ST-001-polish-timer-presets-dialog-ui-aligned-fields-labels-icons
created: 2026-06-09
---

## Context

Timer settings dialog had misaligned form fields, no icons, inconsistent styling. Implements the `overview` note: nice aligned fields w/ proper labels & icons.

## Plan

- Add field icons to the 4 duration `NumberInput`s (focus/short/long/interval).
- Reorder grid → logical order (focus, short, long, interval); put the only description-bearing field (interval) last so its extra height stops misaligning rows.
- Restyle presets: labeled "Quick presets" header + per-preset icon (mapped locally by label, model file not owned).
- Add "Durations" divider for section consistency w/ "Sounds".
- Volume slider gets a leading volume icon.

## Changes contained

- `src/timer/components/TimerSettingsDialog.tsx`

## Out of scope

- `src/timer/models/timerSettingsForm.ts` (preset/icon metadata) — not owned; icons mapped in component.
- Timer logic, mutations, queries, sounds store.

## Verification

- Typecheck: `pnpm run build` (or `tsc -b`) — no TS errors.
- Manual: open Timer settings dialog → fields aligned, icons present, presets apply values, sound/volume/notifications work.

## Implementation output

Reworked `TimerSettingsDialog.tsx`:

- `@tabler/icons-react` icons added; local `PRESET_ICONS` map (Classic→Clock, Deep work→Brain, Short bursts→Bolt).
- Presets now a `Stack` w/ "Quick presets" header (Bolt icon) + icon buttons.
- New "Durations" `Divider`; `SimpleGrid` reordered focus→short→long→interval, each `NumberInput` w/ `leftSection` icon (Brain/Coffee/Moon/Repeat); interval last (only one w/ description) → rows aligned.
- Volume `Slider` wrapped in `Group` w/ `IconVolume`.
  No model/API/logic changes.

## Notes/decisions

- Preset icons keyed by label in the component since `timerSettingsForm.ts` is owned by another boundary; if presets later carry icon metadata, move the map there.
- Kept `(min)` in labels rather than a `suffix`/`rightSection` to avoid clashing with the NumberInput stepper controls.
