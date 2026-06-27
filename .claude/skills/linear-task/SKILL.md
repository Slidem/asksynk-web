---
name: linear-task
description: Work a frontend/UI Linear ticket end to end from its issue ID. Use this whenever the user references a Linear issue (e.g. "work on FE-123", "build this ticket", a linear.app URL, or just pastes an issue ID) and the work is client-side — React components, screens, forms, TanStack Query data fetching, state, styling. It fetches the issue, clarifies every unknown before coding, checks which backend APIs already exist via the OpenAPI spec at http://localhost:3000/docs-json, records any missing APIs under missingApis/, flips the issue to In Progress, implements, verifies, and marks it Done only after the user explicitly confirms. Use it even if the user just pastes an issue ID with no other instruction.
---

# Linear task

Drive a single frontend Linear ticket from "I have an ID" to "the user confirmed it's done" — clarifying first, building against the real backend contract, and explicitly recording any API the backend doesn't provide yet.

You have the Linear MCP plugin available. Use whatever issue tools it exposes (fetch issue, update/save issue, list issue statuses, create comment). Tool names vary by plugin version — adapt to what's installed rather than assuming a fixed name.

## Two rules that override convenience

1. **Do not write a line of implementation code until the task is unambiguous.** A wrong screen costs far more than a few questions. If anything is unclear, stop and ask.
2. **Do not move the issue to Done on your own.** Only the user decides it's done. You may reach "ready for review", but the final transition waits for their explicit confirmation.

## Phase 1 — Load the issue

Given the identifier (e.g. `FE-123`) or a Linear URL (extract the identifier from the URL):

- Fetch the issue: title, description, acceptance criteria, current workflow state, team, assignee, priority, labels, project, parent, sub-issues, comments, and attachments/links (designs, specs, related PRs).
- Read the comment thread. Requirements are often refined there, not in the description.
- If the issue has sub-issues, read them and decide with the user whether this run covers the parent, one sub-issue, or all of them.

If the identifier doesn't resolve, say so and ask for a correct one. Don't guess.

## Phase 2 — Clarify (hard gate)

Reconstruct what "done" means for this ticket, then find the gaps. Treat each of these as a blocker until resolved:

- Description / acceptance criteria empty or vague → ask for the concrete UX and expected behavior.
- No design / Figma linked, or the link is inaccessible → ask whether a design exists; if not, agree on layout and behavior before building.
- Undefined states: loading, empty, error, partial, permission/role-gated views, optimistic vs pessimistic updates.
- Interaction details: validation rules and messages, success/failure feedback, navigation, pagination/infinite scroll, sorting/filtering.
- Responsive/breakpoint expectations and accessibility requirements.
- **Which data this screen needs** — list the reads and writes it implies. You'll reconcile these against the backend in Phase 3.5.
- Scope boundaries: what is explicitly out of scope for this ticket.

Edge cases to check before proceeding:

- Issue already **Done / Canceled / Duplicate** → confirm the user really wants to (re)open work on it.
- Issue **assigned to someone else** → flag it and confirm you should proceed.
- Issue is a **parent epic** with many sub-issues → confirm the intended scope.

Ask your questions **concisely and batched** (not one at a time), each phrased so a one-line answer resolves it. Then wait. Re-loop until there are zero open unknowns. Only when the user has answered everything and signaled "go" do you continue.

## Phase 3 — Mark In Progress

Once the task is clear and the user is ready:

- List the team's workflow states and pick the one of type **started** — its name varies ("In Progress", "Started", "In Development"). Set the issue to that state.
- If it's already in a started state, leave it.
- Optionally add a short comment noting work has begun, including any assumptions agreed in Phase 2.
- If the status update fails (e.g. permissions), don't block: warn the user, ask them to flip it manually, and continue.

## Phase 3.5 — Reconcile against the backend API

Before building any data-fetching, find out what the backend actually offers. The live OpenAPI spec is at **http://localhost:3000/docs-json**.

- Fetch it — e.g. `curl -s http://localhost:3000/docs-json`. It's large, so filter with `jq`: list paths with `... | jq '.paths | keys'`, then inspect the relevant paths, tags, and schemas.
- For each read/write the ticket needs, match it to an existing endpoint and confirm method, path, params, and request/response schema. Build against these real contracts (this stack uses TanStack Query).
- If the spec is unreachable, the backend probably isn't running — tell the user to start it before continuing. Don't invent endpoint shapes from memory.

### When a required API doesn't exist

If the ticket needs an endpoint the backend doesn't expose, **don't silently mock or fake it**. Record it so the backend team gets a precise spec:

- Create `missingApis/<TICKET-ID>.md` at the **repo root** (create the `missingApis/` folder if it doesn't exist). Name the file after the Linear identifier — optionally `<TICKET-ID>-short-slug.md`.
- Keep it concise. For each missing endpoint, include:
  - **Purpose** — one line on what the UI needs it for.
  - **Method + path** — your proposed `GET /…`, `POST /…`, etc.
  - **Request** — params / body shape.
  - **Response** — expected shape, i.e. the fields the UI consumes.
  - **Notes** — auth/scoping, pagination, error cases, anything load-bearing.
- In the frontend code, wire the UI against a clearly-typed interface for the missing endpoint so it's ready to connect, and mark it (e.g. `// TODO(missingApis): <TICKET-ID>`) rather than leaving a hidden stub.
- Leave a Linear comment linking the ticket to the `missingApis/<TICKET-ID>.md` entry, and raise it again in the Phase 6 hand-off so the dependency is visible.

If the ticket is pure UI and needs no new backend support, skip the file entirely.

## Phase 4 — Implement

- Plan against the agreed UX and the real (or recorded-as-missing) contracts. Follow existing repo conventions — component structure, TanStack Query patterns, state management, styling, form/validation approach. Match what's there rather than importing new patterns.
- Cover the states agreed in Phase 2 (loading / empty / error / permissions), not just the happy path.
- Keep scope to the ticket; note adjacent issues instead of absorbing them.

## Phase 5 — Verify

Run the project's checks — typecheck, lint, build, and the relevant tests — and fix what breaks. Add or adjust tests for the behavior and edge states. Don't call it finished while any check is red.

## Phase 6 — Hand off and confirm (hard gate on Done)

- Summarize what changed, mapped point-by-point to the acceptance criteria.
- Explicitly list any `missingApis/` entries created and the backend work they imply.
- Note assumptions made, anything deferred, and any follow-ups.
- Ask the user to confirm it's done.

**Only after the user explicitly confirms**, transition the issue to the team's **completed** state (resolve its real name the same way as Phase 3) and optionally post a closing comment. If they want changes, stay in the loop and leave the status untouched.
