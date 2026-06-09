---
id: ST-004
task: add-user-profile-and-settings
title: Wire own avatar + menu link in app shell
status: todo
source: overview
depends_on: [ST-003]
owns:
  - src/app/components/Navbar/Navbar.tsx
branch: feat/ST-004-wire-own-avatar-menu-link-in-app-shell
created: 2026-06-09
---

## Context

Final `overview` slice: the signed-in avatar must show the uploaded profile picture.
Today `UserProfile` in Navbar renders `session.user?.image` (auth-provider image), not the
new `/profile` `avatar.url`. Also add a menu link into `/settings`. Other people's avatars
already render — every `UserBadge` call site passes `image` from its DTO — so no change there.

## Plan

Edit only `src/app/components/Navbar/Navbar.tsx`:
- In `UserProfile`, call `useProfile()` (from `@/profile/hooks/queries/useProfile`).
- Pass `image={profile?.avatar?.url ?? session.user?.image}` into the `UserBadge`.
- Add a `Menu.Item` "Profile & settings" (e.g. `IconUserCog`/`IconSettings`) as
  `component={Link} to="/settings"`, above the Sign out divider.
- Keep email item + Sign out as-is.

## Changes contained

- `src/app/components/Navbar/Navbar.tsx`

## Out of scope

- `UserBadge` component itself — already supports `image`, no change.
- Profile data layer / `useProfile` hook — owned by ST-003 (import only).
- Other call sites of `UserBadge` (messages/network/schedule) — already wired.

## Verification

- Typecheck/build: prompt user (do not run dev).
- Manual: after uploading an avatar in `/settings`, Navbar avatar reflects it (no reload);
  menu shows "Profile & settings" → navigates to `/settings`.

## Implementation output
<!-- FILL AFTER WORK. What was built and key files. Required before in-review/done. -->

## Notes/decisions
<!-- Anything worth recording for reviewers. -->
