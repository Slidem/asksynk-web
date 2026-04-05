---
name: react-perf
description: >
  Audit React components for useEffect misuse, unnecessary re-renders, and
  performance problems. Suggests better hook alternatives. Use when the user
  says "check performance", "react perf", "useEffect audit", "re-render
  issues", "why is this slow", "optimize renders", "check my hooks", "hooks
  audit", mentions performance problems in the frontend, or asks about
  unnecessary re-renders.
allowed-tools: Read, Grep, Glob, Bash
---

# React Performance Audit

Deep audit of React components focused on hooks misuse, render performance,
and optimization opportunities.

## Step 1 — Identify Scope

If the user points to specific files, audit those. Otherwise, scan the
components directory:

```bash
# Find components with useEffect
grep -rl "useEffect" src/ --include="*.tsx" --include="*.ts"
```

Prioritize files with multiple useEffect calls — they're most likely to
have issues:

```bash
grep -c "useEffect" src/**/*.tsx 2>/dev/null | grep -v ":0$" | sort -t: -k2 -rn | head -15
```

## Step 2 — useEffect Misuse (highest priority)

For each component with useEffect, check:

### A. Derived State

State that could be computed during render but is synced via useEffect + useState.

**Detection**: Look for patterns where `useEffect` calls a `setState` function
and the effect's dependencies are the inputs to compute that state.

```tsx
// 🔴 This pattern
const [derived, setDerived] = useState(initial);
useEffect(() => {
  setDerived(computeFrom(dep1, dep2));
}, [dep1, dep2]);

// ✅ Should be
const derived = computeFrom(dep1, dep2);
// or if expensive:
const derived = useMemo(() => computeFrom(dep1, dep2), [dep1, dep2]);
```

### B. Missing Cleanup

Effects that add listeners, create subscriptions, start timers, or open
connections without returning a cleanup function.

```bash
# Quick scan for common patterns without cleanup
grep -n "addEventListener\|setInterval\|setTimeout\|subscribe\|observe" src/**/*.tsx
```

### C. Over-broad Dependencies

Effects that fire too often because dependencies include unstable references:

```tsx
// 🔴 options is a new object every render — effect fires every render
useEffect(() => {
  fetchData(options);
}, [options]); // { page, limit } created in render body

// ✅ Depend on primitives
useEffect(() => {
  fetchData({ page, limit });
}, [page, limit]);
```

### D. Cascading Effects

One effect sets state → triggers another effect → sets more state.
Usually means the data flow needs restructuring.

**Detection**: Multiple useEffects in the same component where one's setState
target appears in another's dependency array.

### E. Data Fetching

Raw `useEffect` + `fetch` without:

- Race condition handling (AbortController or ignore stale)
- Caching
- Loading/error state management

**Recommendation**: Migrate to TanStack Query.

## Step 3 — Re-render Analysis

### Unstable Props

Scan for components that receive new object/array/function references
on every parent render:

```tsx
// 🔴 Patterns to flag
<Child config={{ theme: 'dark' }} />           // new object each render
<Child items={data.filter(predicate)} />       // new array each render
<Child onChange={(val) => setForm({...form, field: val})} />  // new fn each render
```

### Missing React.memo

Components that:

- Are rendered in a `.map()` with 20+ items
- Receive stable primitive props but re-render with parent
- Are expensive (complex JSX tree, heavy computation in render)

These are candidates for `React.memo`.

### Context Consumers

Check for context providers whose value is a new object every render:

```tsx
// 🔴 Every consumer re-renders on any parent render
<Ctx.Provider value={{ user, setUser, theme, setTheme }}>
```

## Step 4 — Better Hook Alternatives

For each issue found, suggest the right replacement:

| Current Pattern                        | Better Alternative               |
| -------------------------------------- | -------------------------------- |
| useState + useEffect for derived state | const / useMemo                  |
| useState + useEffect for data fetching | useQuery (TanStack Query)        |
| useState + useEffect for subscriptions | useSyncExternalStore             |
| useRef + useEffect for DOM measurement | ResizeObserver + useLayoutEffect |
| Complex useState with multiple fields  | useReducer                       |
| useState for URL-driven state          | useSearchParams                  |
| useEffect for event handlers           | event handler directly           |
| useEffect to sync with parent          | lift state up or callback prop   |

## Step 5 — Output

````
## React Performance Audit

**Scope**: N components analyzed
**useEffects found**: N total, M with issues

### 🔴 Critical — Will cause bugs or visible perf issues

**[C1] Derived state in useEffect** — `Component.tsx:42`
❌ Current:
```tsx
(code snippet)
````

✅ Fix:

```tsx
(code snippet)
```

💡 This causes a double render on every [dep] change. Users see a flicker
on [interaction].

### 🟡 Warning — Suboptimal but not actively harmful

**[W1] Missing cleanup on resize listener** — `Component.tsx:67`
❌ Current: (snippet)
✅ Fix: (snippet)
💡 Leaks one listener per mount. After navigating away and back 10 times,
there are 10 active listeners.

### 🟢 Good Patterns Spotted

- (what the codebase does well)

### Summary Table

| Component | useEffects | Issues | Severity   |
| --------- | ---------- | ------ | ---------- |
| UserList  | 3          | 2      | 🔴 1, 🟡 1 |
| Dashboard | 5          | 1      | 🟡 1       |
| Settings  | 1          | 0      | ✅ clean   |

```

Focus on actionable fixes. Skip issues that are theoretical — only flag
problems that would cause real user-facing impact or measurable perf cost.
```
