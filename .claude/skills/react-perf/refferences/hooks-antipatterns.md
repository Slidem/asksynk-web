# React Hooks Antipatterns Catalogue

Comprehensive reference of hooks misuse patterns, ordered by impact.
Each entry has: the antipattern, why it's bad, the fix, and a code example.

---

## 1. Synchronizing Derived State

**Antipattern**: Using `useState` + `useEffect` to compute a value that is
fully determined by existing props or state.

**Why it's bad**: Causes an unnecessary render. React renders with the stale
derived value, then the effect fires, sets state, and triggers a second render
with the correct value. Users may see a flash of stale data.

**Fix**: Compute during render (inline or `useMemo`).

```tsx
// ❌ BAD — two renders
function UserCard({ firstName, lastName }) {
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);
  return <h1>{fullName}</h1>;
}

// ✅ GOOD — one render
function UserCard({ firstName, lastName }) {
  const fullName = `${firstName} ${lastName}`;
  return <h1>{fullName}</h1>;
}

// ✅ GOOD — expensive computation
function FilteredList({ items, query }) {
  const filtered = useMemo(
    () => items.filter((i) => i.name.includes(query)),
    [items, query],
  );
  return <List items={filtered} />;
}
```

**Detection**: Grep for the pattern `useEffect(() => { set` — any effect whose
sole purpose is calling a setState is suspicious.

---

## 2. Resetting State on Prop Change

**Antipattern**: Using `useEffect` to reset state when a prop changes.

**Why it's bad**: Same double-render problem. Also brittle — easy to forget
a state variable that should reset.

**Fix**: Use a `key` prop to remount the component with fresh state.

```tsx
// ❌ BAD
function Editor({ docId }) {
  const [content, setContent] = useState("");
  useEffect(() => {
    setContent("");
  }, [docId]);
}

// ✅ GOOD — parent uses key
<Editor key={docId} docId={docId} />;
```

---

## 3. useEffect as Event Handler

**Antipattern**: Using `useEffect` to react to a state change that represents
a discrete event (form submission, button click, navigation).

**Why it's bad**: Couples the side effect to the render cycle instead of the
user action. Harder to trace, can fire unexpectedly on re-renders.

**Fix**: Put the logic in the event handler directly.

```tsx
// ❌ BAD — effect as event handler
const [submitted, setSubmitted] = useState(false);
useEffect(() => {
  if (submitted) {
    sendAnalytics("form_submit");
    setSubmitted(false);
  }
}, [submitted]);

function handleSubmit() {
  setSubmitted(true);
}

// ✅ GOOD — logic in the handler
function handleSubmit() {
  submitForm(data);
  sendAnalytics("form_submit");
}
```

---

## 4. Cascading Effects

**Antipattern**: Effect A sets state → triggers Effect B → sets state →
triggers Effect C.

**Why it's bad**: Multiple unnecessary renders, hard to follow data flow,
and order-dependent bugs. This is the "effect waterfall".

**Fix**: Merge into a single effect, use a reducer, or restructure so the
data flows top-down.

```tsx
// ❌ BAD — cascade
useEffect(() => {
  setA(computeA(raw));
}, [raw]);
useEffect(() => {
  setB(computeB(a));
}, [a]);
useEffect(() => {
  setC(computeC(b));
}, [b]);

// ✅ GOOD — single computation
const a = useMemo(() => computeA(raw), [raw]);
const b = useMemo(() => computeB(a), [a]);
const c = useMemo(() => computeC(b), [b]);
```

---

## 5. Missing Cleanup

**Antipattern**: Effects that subscribe, listen, or start timers without
returning a cleanup function.

**Why it's bad**: Memory leaks, stale callbacks, and ghost listeners that
accumulate on re-renders (since effects re-run when deps change).

```tsx
// ❌ BAD — no cleanup
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);

// ✅ GOOD
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

**Detection**: Any effect that calls `addEventListener`, `subscribe`,
`setInterval`, `setTimeout`, or opens a WebSocket should have a `return`.

---

## 6. Over-Broad Dependencies

**Antipattern**: Dependency array includes objects or arrays created during
render, causing the effect to re-run on every render.

```tsx
// ❌ BAD — options is a new object every render
function Search({ query }) {
  const options = { query, limit: 10 };
  useEffect(() => {
    fetchResults(options);
  }, [options]); // runs every render!
}

// ✅ GOOD — stable deps
function Search({ query }) {
  useEffect(() => {
    fetchResults({ query, limit: 10 });
  }, [query]);
}
```

**Detection**: Check if any dep in the array is an object/array literal or
function defined in the component body without `useMemo`/`useCallback`.

---

## 7. Data Fetching Without a Library

**Antipattern**: Raw `useEffect` + `fetch` + `useState` for loading, error,
and data states.

**Why it's bad**:

- Race conditions: fast navigation creates stale responses that overwrite fresh data
- No request deduplication: multiple mounts fetch the same data
- No caching: navigating away and back re-fetches
- Cleanup is manual and error-prone

**Fix**: Use TanStack Query (React Query), SWR, or similar.

```tsx
// ❌ BAD
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
  let cancelled = false;
  fetch(`/api/item/${id}`)
    .then((r) => r.json())
    .then((d) => {
      if (!cancelled) setData(d);
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });
  return () => {
    cancelled = true;
  };
}, [id]);

// ✅ GOOD
const { data, isLoading } = useQuery({
  queryKey: ["item", id],
  queryFn: () => fetch(`/api/item/${id}`).then((r) => r.json()),
});
```

---

## 8. Unstable Callback Props

**Antipattern**: Passing inline arrow functions as props to memoized children
or in lists.

```tsx
// ❌ BAD — new function every render, defeats React.memo
<MemoizedChild onClick={() => handleClick(item.id)} />;

// ✅ GOOD — stable reference
const handleItemClick = useCallback((id) => {
  // ...
}, []);
<MemoizedChild onClick={handleItemClick} itemId={item.id} />;
```

**Important nuance**: This only matters when the child is wrapped in
`React.memo` or appears in a large list. For simple components with cheap
renders, inline arrows are fine.

---

## 9. Context Provider Bombing

**Antipattern**: A context provider that holds a large state object and
updates it frequently, causing all consumers to re-render even if they only
use one field.

**Fix**:

- Split into multiple focused contexts
- Use `useSyncExternalStore` for fine-grained subscriptions
- Memoize the context value

```tsx
// ❌ BAD — all consumers re-render on any change
<AppContext.Provider value={{ user, theme, notifications, cart }}>

// ✅ GOOD — separate contexts
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <NotificationContext.Provider value={notifications}>
```

---

## 10. State That Belongs in the URL

**Antipattern**: Storing filter values, search queries, pagination, or tab
selection in `useState` when it should be in URL search params.

**Why it's bad**: State is lost on refresh, can't be shared via link, breaks
browser back/forward navigation.

**Fix**: Use `useSearchParams` (React Router) or framework-equivalent.

```tsx
// ❌ BAD
const [page, setPage] = useState(1);
const [filter, setFilter] = useState("all");

// ✅ GOOD
const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get("page") ?? 1);
const filter = searchParams.get("filter") ?? "all";
```
