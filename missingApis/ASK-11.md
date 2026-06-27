# ASK-11 — Missing backend API

Public-view nav bar (ASK-11) shows a **bell + counter** on the "Pending actions"
tab. There is no guest-scoped endpoint to source that count. The UI is wired
against the contract below via a **disabled** query
(`usePublicPendingActionsCountQuery`, `enabled: false`) and
`fetchPublicPendingActionsCount`; flip `enabled` to `true` once this ships.

## GET /public/pending-actions/count

- **Purpose** — number of pending actions awaiting the current guest in this
  public view; drives the bell counter on the Pending actions tab.
- **Request** — no body/params. Guest-scoped via the guest session token
  (sent through `apiFetch({ allowGuestSession: true })`, same auth as
  `/calendar-events` and `/public/thread/messages`).
- **Response** — `{ "count": number }`.
- **Notes**
  - Scope to the guest's `publicViewId` + owner; only count items the guest can
    act on. Return `0` (not 404) when there are none.
  - "Pending action" is still undefined for guests (candidates: owner's
    suggested timeblocks/tasks to the guest, or the guest's unresolved tagged
    messages). The count endpoint can ship first; the list/panel is a separate
    future ticket.
