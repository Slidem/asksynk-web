---
name: frontend-review
description: >
  Review frontend code changes (React, TypeScript, CSS/Tailwind) for hooks
  misuse, re-render issues, accessibility gaps, TypeScript looseness, and
  component design problems. Runs type checks and lint if available. Use when
  the user says "review frontend", "review my components", "check my react code",
  "frontend review", "frontend CR", "review the UI code", "check my tsx",
  or any review request targeting .tsx/.jsx/.css files.
allowed-tools: Read, Grep, Glob, Bash
---

# Frontend Code Review

Review React + TypeScript changes with frontend-specific priorities.

## Step 1 — Get the diff (frontend files only)

Run in order, use the first with output:

1. `git diff --staged -- '*.tsx' '*.jsx' '*.ts' '*.css' '*.scss'`
2. `git diff -- '*.tsx' '*.jsx' '*.ts' '*.css' '*.scss'`
3. `git diff HEAD~1 -- '*.tsx' '*.jsx' '*.ts' '*.css' '*.scss'`

Exclude backend files (controllers, services, schemas) even if they appear.
Filter to `src/` or the frontend source root if the project is a monorepo.

Store the list of changed files.

## Step 2 — Read full context

For every changed file, read the **entire file**. Also read:

- Any custom hooks the component imports from the project (`use*.ts`)
- The parent component if the changed component receives props (to understand
  reference stability)
- Type definitions imported from `types/`

## Step 3 — Analyze

Check each category in priority order. See `references/frontend-review-checklist.md`
for the detailed checklist with detection tips and code examples.

**Priority 1 — Hooks Misuse & Re-renders**:
Derived state via useEffect+useState, missing cleanup, cascading effects,
over-broad deps, raw fetch without TanStack Query, useEffect-as-event-handler,
unstable prop references to memoized children.

**Priority 2 — Bugs & Logic**:
Conditional hook calls, stale closures, missing/non-unique keys, controlled/
uncontrolled mixing, async state updates after unmount, type assertions hiding
real null paths.

**Priority 3 — Accessibility**:
Missing alt text, click handlers on non-interactive elements without role/tabIndex/
keyboard handler, missing label association, color-only status indicators,
missing focus management in modals.

**Priority 4 — TypeScript**:
`any` types, missing return types on exported hooks/utils, loose generics,
type assertions instead of type guards.

**Priority 5 — Component Design**:
God components (>200 lines mixing concerns), prop drilling past 3 levels,
hardcoded user-facing strings, dead code.

**Priority 5b — Project layout (hooks / APIs)** — canonical ref `src/tags/`
and `src/schedule/`. Flag: monolith `hooks/api.ts` / `hooks/mutations.ts` /
`hooks/queries.ts`; fetch calls inside hook files (belong in `apis/<fn>.ts`);
dialog hooks loose at the `hooks/` root (must live under
`hooks/dialogs/<name>DialogHooks.ts` per dialog store); mutation hooks named
`useXxxMutation` (drop the suffix); duplicated query-key derivation across
query + mutation files (extract to `hooks/queries/useXxxQueryData.ts`);
barrel exports (`index.ts` re-exports) — always import specific files via
`@/<feature>/…`.

**Priority 6 — Styling** (only flag clear problems):
Complex inline styles that belong in Tailwind classes, magic pixel numbers,
z-index without a scale.

Skip pure formatting preferences. Don't suggest `React.memo` on every component
— only where the component is in a hot path with expensive renders.

## Step 4 — Run automated checks

```bash
# Type check
npx tsc --noEmit 2>&1 | tail -20

# Lint (frontend files only)
npx eslint src/ --ext .tsx,.ts --max-warnings 0 2>&1 | tail -20
```

Report errors tied to the changed files. If the commands don't exist, note it
and skip.

## Step 5 — Output

```
## Frontend Review Summary
**Risk level**: Low / Medium / High
**Diff scope**: N files changed, +X / -Y lines
**Type check**: ✅ clean / ❌ N errors
**Lint**: ✅ clean / ❌ N warnings/errors

## Issues

### 🔴 Critical
> Broken hooks, bugs that affect users, accessibility violations.

**[C1] Title** — `Component.tsx:42`
❌ Current:
(3-5 line code snippet)
✅ Fix:
(code snippet)
💡 Why this matters in one sentence.

### 🟡 Warning
> Suboptimal patterns, TypeScript looseness, minor a11y gaps.

(same structure)

### 💡 Suggestion
> Non-blocking improvements worth considering.

(same structure)

## What Looks Good
- (brief positive callouts)
```

If there are zero issues, say so — don't invent problems.
