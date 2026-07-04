# ASK-12 — Missing backend API

The public-view direct-message view (ASK-12) reuses the existing guest read
endpoints (`GET /public/thread/messages`, `.../replies`) but needs three new
guest-scoped capabilities. All guest auth is the guest session token — passed as
`Bearer` for REST (`apiFetch({ allowGuestSession: true })`) and, for the socket,
in the handshake `auth.token`.

## 1. WebSocket — guest `message.send`

- **Purpose** — let the guest send a message to the view owner (the composer).
  The authed app sends over a cookie-auth'd socket gateway; guests have no
  cookie and there is no REST POST, so the guest needs socket access.
- **Connection** — guest connects with the session token in the
  `Authorization: Bearer <token>` header, same credential as the REST guest APIs.
  Because browsers can't set headers on a raw WebSocket handshake, the client
  uses `transports: ["polling", "websocket"]` so the header lands on the polling
  handshake, then upgrades to websocket. Gateway authenticates the guest from
  that header (reuse the REST guest guard) and auto-joins the guest's single
  thread room (the thread is implied by the session — guest never has a
  `threadId` for an empty thread).
- **Client → server** — `message.send` `{ body: string, tagIds: string[] }`,
  ack `{ ok: boolean, messageId?: string, error?: string }`. `tagIds` are the
  owner's tags the guest applied (see #4) — **only the guest tags**; the owner
  replies untagged. Backend creates the message + the owner's routing/attention
  item from these tags.
- **Server → client** — `message.created` `{ message: ThreadMessageResponseDto }`
  broadcast to both participants (echoes the message, which carries `threadId`).
- **Notes** — wired live in the frontend (`guestMessageSocket.ts`,
  `useGuestMessageSocket`, `useSendGuestMessage`); if the gateway doesn't yet
  accept guest auth, sending will fail at runtime until this ships.

## 2. GET /public/thread/tagged-messages

- **Purpose** — fuzzy search over the guest's tagged messages; drives the quick
  search bar (each hit scrolls the conversation to that message).
- **Request** — query `?q=<string>` (optional; empty/absent = all). Guest-scoped
  via the session token.
- **Response** — `PublicTaggedMessage[]`:
  `{ messageId, tag: { id, name, color }, preview, status: "resolved" | "pending", createdAt }`.
  `tag` is the message's primary tag (name + color so the guest can render it
  without a guest tags endpoint). `preview` is a short content snippet.
- **Notes** — fuzzy match over message body. Scope to the guest's own tagged
  messages in this view. UI wired against `fetchPublicTaggedMessages` /
  `usePublicTaggedMessagesQuery` (disabled until this ships).

## 3. GET /public/thread/tagged-messages/stats

- **Purpose** — resolved/pending counts shown in the stats bar above the thread.
- **Request** — no params. Guest-scoped via the session token.
- **Response** — `{ resolved: number, pending: number }`.
- **Notes** — `pending` = guest's tagged messages whose owner attention item is
  not yet resolved (created/in_progress); `resolved` = resolved. UI wired against
  `fetchPublicTaggedMessageStats` / `usePublicTaggedMessageStatsQuery` (disabled
  until this ships). Could be derived from #2, but a dedicated endpoint avoids
  over-fetching.

## 4. GET /public/tags

- **Purpose** — the view owner's tags, so the guest can tag the messages
  (questions) they send. The composer picker + message-bubble chips read from
  this. **Only the guest tags** — the owner replies untagged (the owner's
  composer in a guest thread already has tagging disabled, `recipientUserId === null`).
- **Request** — no params. Guest-scoped via the session token.
- **Response** — `PublicTag[]`: `{ id, name, color }`.
- **Notes** — backend decides which of the owner's tags are exposed publicly
  (all, or a "public" subset). UI wired against `fetchPublicTags` /
  `usePublicTagsQuery` (disabled until this ships); the picker is disabled while
  empty.
