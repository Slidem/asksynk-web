# Frontend Review Checklist — React + TypeScript

Detailed checklist for the frontend-review skill. Each item includes what to
look for, why it matters, and a detection shortcut.

---

## 1. Hooks Misuse & Re-renders

### 1.1 Derived State via useEffect + useState

**Detect**: Grep for `useEffect(() => { set` — any effect whose body only
calls a setState is almost certainly derived state.

```tsx
// ❌ Double render on every dependency change
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(price * quantity);
}, [price, quantity]);

// ✅ Inline
const total = price * quantity;

// ✅ Expensive computation
const total = useMemo(() => heavyCalc(price, quantity), [price, quantity]);
```

### 1.2 Missing Cleanup

**Detect**: Effects that call `addEventListener`, `subscribe`, `setInterval`,
`setTimeout`, `new WebSocket`, `new EventSource` without a `return () => ...`.

```tsx
// ❌ Leaks a listener on every re-render
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);

// ✅
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

### 1.3 Cascading Effects

**Detect**: Multiple `useEffect` blocks where one sets state that appears in
another's dependency array.

```tsx
// ❌ Effect waterfall — 3 extra renders
useEffect(() => {
  setA(transform(raw));
}, [raw]);
useEffect(() => {
  setB(derive(a));
}, [a]);

// ✅ Derive directly
const a = useMemo(() => transform(raw), [raw]);
const b = useMemo(() => derive(a), [a]);
```

### 1.4 Over-Broad Dependencies

**Detect**: Dependency array contains a variable that is an object/array
literal or function defined in the component body without `useMemo`/`useCallback`.

```tsx
// ❌ options is a new object every render
const options = { query, limit: 10 };
useEffect(() => {
  fetchData(options);
}, [options]); // fires every render

// ✅ Move creation inside the effect or memoize
useEffect(() => {
  fetchData({ query, limit: 10 });
}, [query]);
```

### 1.5 Raw Data Fetching in useEffect

**Detect**: `useEffect` body contains `fetch(` or `axios.` with `useState`
for loading/error/data.

**Problems**: No race condition handling, no caching, no request deduplication,
no retry, manual loading/error states.

**Fix**: TanStack Query.

### 1.6 useEffect as Event Handler

**Detect**: A `useState` boolean (like `submitted`, `clicked`, `triggered`)
used as a dependency in `useEffect`, set to `true` in a handler, and reset
to `false` in the effect.

**Fix**: Move the side effect into the event handler directly.

### 1.7 Unstable Prop References

**Detect**: JSX passing `{{ ... }}`, `[...]`, or `() => ...` directly as
props to a child that is wrapped in `React.memo` or rendered in a list.

```tsx
// ❌ New object on every render — defeats memo
<MemoChild style={{ color: "red" }} />;

// ✅ Stable reference
const style = useMemo(() => ({ color: "red" }), []);
<MemoChild style={style} />;
```

---

## 2. Bugs & Logic

### 2.1 Conditional Hook Calls

**Detect**: Any hook call (`useState`, `useEffect`, `useMemo`, `useCallback`,
`useRef`, custom `use*`) that appears inside an `if` block, ternary, `switch`,
loop, or after an early `return`.

This violates the Rules of Hooks and causes React to crash.

### 2.2 Stale Closures

**Detect**: `useCallback` or `useEffect` that reads a state variable but
doesn't list it in the dependency array. ESLint `react-hooks/exhaustive-deps`
catches this, but check if the rule is enabled.

```tsx
// ❌ count is stale — always 0
const handleClick = useCallback(() => {
  setCount(count + 1);
}, []); // missing count

// ✅ Use functional update
const handleClick = useCallback(() => {
  setCount((prev) => prev + 1);
}, []);
```

### 2.3 Missing or Non-Unique Keys

**Detect**: `.map()` calls in JSX where `key` is `index` and the list can
be reordered, filtered, or have items added/removed. Also check for duplicate
`key` values.

### 2.4 Controlled/Uncontrolled Mixing

**Detect**: An input that starts with `value={undefined}` (uncontrolled) and
later receives a defined `value` (controlled), or vice versa. Common when
state initializes as `undefined`.

### 2.5 Async State Updates After Unmount

**Detect**: `.then(() => setState(...))` or `setTimeout(() => setState(...))`
without a cleanup mechanism. In React 18+ with StrictMode this is less of a
memory leak issue, but still causes "can't perform state update on unmounted
component" in some setups.

### 2.6 Type Assertions Hiding Bugs

**Detect**: `as any`, `as unknown as SomeType`, `variable!` non-null assertions.
Each one is a skipped runtime check. Flag them when the value genuinely can
be null/undefined at runtime.

---

## 3. Accessibility

### 3.1 Images Without Alt

**Detect**: `<img` without `alt=`. Decorative images should use `alt=""`.

### 3.2 Non-Interactive Elements With Click Handlers

**Detect**: `onClick` on `<div>`, `<span>`, `<li>`, `<td>` without
`role="button"`, `tabIndex={0}`, and `onKeyDown`/`onKeyUp` for Enter/Space.

### 3.3 Missing Label Association

**Detect**: `<input>`, `<select>`, `<textarea>` without a corresponding
`<label htmlFor={id}>` or `aria-label`/`aria-labelledby`.

### 3.4 Color-Only Indicators

**Detect**: Status badges or indicators that use only background color
(green/red/yellow) without accompanying text, icon, or `aria-label`.

### 3.5 Focus Management

**Detect**: Modal/dialog components that don't use `<dialog>`, `focus-trap`,
or manual focus management. Route changes that don't announce to screen readers.

---

## 4. TypeScript

### 4.1 `any` Types

**Detect**: `grep -rn ": any\|<any>\|as any" --include="*.tsx" --include="*.ts" src/`

Every `any` is a hole in type safety. Replace with `unknown` + type guard,
or define a proper interface.

### 4.2 Missing Return Types

**Detect**: Exported functions and hooks (`export function use*`, `export const`)
without explicit return type annotations. The inferred type might change
unexpectedly when the implementation changes.

### 4.3 Loose Generics

**Detect**: `useState<object>()`, `Record<string, any>`, `Map<string, any>`.
If the shape is known, type it.

### 4.4 Type Assertions Over Type Guards

**Detect**: `(x as User).name` instead of checking a discriminant field or
using the `in` operator.

---

## 5. Component Design

### 5.1 God Components (>200 lines)

**Detect**: `wc -l` on changed components. If over 200 lines, check whether
it mixes data fetching, business logic, and presentation. Split into:

- Container (data fetching + state)
- Presenter (pure rendering)
- Custom hook (reusable logic)

### 5.2 Prop Drilling

**Detect**: A prop passed through 3+ component levels where intermediate
components don't use it. Fix with composition (children/render props),
context, or restructuring the component tree.

### 5.3 Hardcoded User-Facing Strings

**Detect**: String literals in JSX that are user-visible. If the project uses
i18n, these should be translation keys. If not, they should at least be
constants for easy search and update.

### 5.4 Dead Code

**Detect**: Props defined in the interface but never used in the component
body. Commented-out JSX blocks. Unreachable code after early returns.
