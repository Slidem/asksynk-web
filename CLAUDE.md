- In all interactions and commit messages, be extremely concise, and sacrifice grammar for the sake of concision.
- Don't overengineer (YAGNI)
- Keep best coding practices, and keep things simple

## Plan

- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise, sacrifice grammar for the sake of concision.
- Don't implement things we are not using (use the YAGNI principle)
- Don't design for backwards compatibility, as this project is in MVP state

## Project overview

Asksynk is a productivity app, that's aimed to give user's full control over their attention, their schedule, and how / when they decided to respond to incoming messages from various communication channels.
By leveraging tags as a barrier between incoming communication channels and a user's schedule, users choose how tagged information will be answered. Incoming communication channels: in app message threads, integration with gmail, slack, whatsapp. Calendar integration: two way sync with different calendars (gcal), in app custom calendar. Asksynk will also provide public links for readonly views of a user's schedule (with possibility of directly addressing an issue on a user's timeblock) and also provides the ability to create "networks" of users, that have more access to someones calendar in their network (suggest timeblocks, suggest tasks etc).

## Development Notes

### Project Structure

- **Feature-based structure**: `signin`, `signup`, `verify-email`, `tags`, `schedule`
- **Feature folders include**: `components`, `models`, `hooks`, `store`, `utils`, `apis` (folders or files)
- **Shared components**: `src/components`
- **Shared lib functions**: `src/lib`
- **Shared utils**: `src/utils`
- **DON'T USE BARREL EXPORTS**
- **Use import aliases** Avoid relative imports, use import aliases as defined in tsconfig

### Hooks / APIs folder layout

Canonical reference: `src/tags/` and `src/schedule/`.

- **`apis/`** One file per endpoint, exports a single fn (`fetchX`, `createX`, `updateX`, `deleteX`). No fetch calls inside hook files.
- **`hooks/queries/`** One file per query hook. For query keys derived from filters/view state, add a shared `useXxxQueryData.ts` exporting the key builder + a hook that derives the key; reused by queries and mutations.
- **`hooks/mutations/`** One file per mutation hook; **no `Mutation` suffix** on the hook name. Imports API fn from `apis/`, query key from `queries/useXxxQueryData`.
- **`hooks/dialogs/`** One file per dialog store (e.g. `createTagDialogHooks.ts`), grouping that store's selector + handler hooks.
- **Other store-wrapping hooks** Grouped into a concern-named flat file when they compose as one API (e.g. `tags/hooks/filters.ts`), or one hook per file at the `hooks/` root when independent (e.g. `useScheduleView.ts`).
- **Composite / domain hooks** Live at the `hooks/` root as `useXxx.ts` or `useXxxService.ts` (cross-store, cross-query).
- **One hook per file**, file name matches exported hook name. No barrel exports; always `@/<feature>/…` aliases.

### Component Architecture

- **Keep components small and focused** One component per file. Single Responsibility Principle (SRP).
- **No prop drilling** Use Zustand for shared state instead of passing props through multiple levels
- **Extract sub-components** Split large components into smaller, focused pieces (e.g., `TagsFilters` → `SearchFilter`, `AnswerModeFilter`, etc.)
- **Colocate related logic** Keep component-specific logic close to component usage
- **One component per file** Maximum clarity and maintainability

### State Management (Zustand)

- **Use Zustand for global state** Filters, dialog states, shared UI state
- **Separate stores by concern** Create focused stores (e.g., `tagsFiltersStore`, `editTagDialogStore`, `createTagDialogStore`)
- **Use selectors to prevent re-renders** Subscribe only to needed state slices
- **Use `useShallow` for object selectors** Prevents re-renders on object reference changes
- **subscribeWithSelector middleware** When you need imperative subscriptions to store changes (e.g., syncing forms with store)
- **Derive state in hooks** Create custom hooks that wrap store selectors (e.g., `useTagsFilter`, `useUpdateTagFilter`)

### Performance Optimization

- **Granular selectors** Subscribe to specific state slices, not entire store
- **Memoize derived values** Use `useMemo` for computed values from filters/state
- **Optimize query keys** Derive once, reuse across mutations and queries
- **React Query placeholderData** Prevent loading flashes on refetch
- **React Query select** Transform data close to query, not in components

### Mantine UI

- **Always check Mantine docs first** https://ui.mantine.dev/ for built-in components and patterns
- **Use Mantine hooks** Leverage existing hooks instead of reinventing:
  - `useDebouncedCallback` for search inputs
  - `useForm` with `watch` for reactive form fields
  - `useDisclosure` for modal/drawer states (or use Zustand if state needs to be shared)
  - `useShallow` from zustand/react/shallow for object selectors
- **Use Mantine components** Modal, Select, TextInput, etc. - fully featured, accessible
- **Uncontrolled forms** Prefer `mode: "uncontrolled"` in `useForm` for better performance
- **Form reactivity** Use `form.watch()` to react to field changes when needed

### Hooks Patterns

- **Custom hooks for store access** Wrap Zustand selectors in named hooks (e.g., `useTagsFilters`, `useEditTagDialogHandlers`)
- **Hooks for mutations** Keep mutation logic in dedicated hooks (e.g., `useCreateTagMutation`)
- **Hooks return focused data** Don't expose entire store, return specific values/functions
- **Reusable, composable hooks** Build small hooks that can be composed together

### Forms & Dialogs

- **Reset forms on close** Always call `form.reset()` when closing dialogs
- **Subscribe to store for form updates** Use Zustand subscribe with selector for reactive form values (see `TagEditDialog` pattern)
- **Avoid form flash** Set form values synchronously via store subscriptions, not in render
- **Modal transitions** Keep modals mounted but controlled by `opened` prop for smooth transitions
- **Uncontrolled forms** Use Mantine's uncontrolled mode for better performance

### Code Style

- **Never fix linting issues** Skip linting issues, I'll fix any linting issue myself
- **Never fix import ordering, or unused imports** I'll fix those myself
- **Always prompt for testing commands** Never run commands like "pnpm run dev"; prompt me so I can do it manually
- **Type safety** Use explicit type aliases for union types (e.g., `TagAnserModeFilterValue`)
- **Avoid premature optimization** Don't split components unless there's a clear re-render benefit

### Testing & Verification

- **Always prompt me for testing commands** Never run any commands to test implementation like "pnpm run dev"; prompt me so i can do it manually; and then continue after i done so

## MCP

- For good understanding of library usage, use context7 where possible
