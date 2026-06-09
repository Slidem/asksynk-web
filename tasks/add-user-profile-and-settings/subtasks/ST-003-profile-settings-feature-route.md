---
id: ST-003
task: add-user-profile-and-settings
title: Profile & settings feature + route
status: todo
source: overview
depends_on: [ST-002]
owns:
  - src/profile
  - src/routes/_authenticated/settings.tsx
branch: feat/ST-003-profile-settings-feature-route
created: 2026-06-09
---

## Context

Realizes `overview`: proper profile page (sleek modern UI) + notification settings, at a new
`/settings` route. Holds profile data layer (GET/PATCH `/profile`) and settings data layer
(GET/PUT `/user-settings`), plus the page that composes both sections. Avatar upload reuses
ST-002's `useUploadAttachment`. Name is **read-only** (PATCH only accepts `phone` +
`avatarAttachmentId`).

## Plan

Mirror `src/tags/` conventions (apis = one fn/file; query key builder in `useXxxQueryData.ts`;
mutations = plain `useMutation` + `useQueryClient().invalidateQueries` + Mantine `notifications`;
hook file name == hook name; `@/` aliases; no barrel exports).

**Models** (`models/`)
- `profile.ts` — `ProfileDto { id; name; firstName; lastName; email; image; phone; avatar: { id; url } | null }`;
  `ProfileUpdateInput { phone?: string | null; avatarAttachmentId?: string | null }`.
- `userSettings.ts` — `UserSettingsDto { attentionItemNotifications: boolean; timerNotifications: boolean }` (also the PUT body — full replace).

**APIs** (`apis/`)
- `fetchProfile.ts` GET `/profile` → `ProfileDto`.
- `updateProfile.ts` PATCH `/profile` (only send provided keys) → `ProfileDto`.
- `fetchUserSettings.ts` GET `/user-settings` → `UserSettingsDto`.
- `updateUserSettings.ts` PUT `/user-settings` (both fields required) → `UserSettingsDto`.

**Hooks**
- `queries/useProfileQueryData.ts` → `getProfileQueryKey()` = `["profile"]`.
- `queries/useProfile.ts` → `useQuery({ queryKey: getProfileQueryKey(), queryFn: fetchProfile })`. (ST-004 reuses this key — keep builder exported.)
- `queries/useUserSettingsQueryData.ts` → `getUserSettingsQueryKey()` = `["user-settings"]`.
- `queries/useUserSettings.ts`.
- `mutations/useUpdateProfile.ts` — invalidate profile key on success; success/error notifications.
- `mutations/useUpdateUserSettings.ts` — invalidate settings key.

**Components** (`components/`)
- `SettingsPage.tsx` — page shell (header + stacked sections; sleek modern Mantine layout).
- `ProfileSection.tsx` — avatar (UserBadge/Avatar) + name/email (read-only) + phone field (save → `useUpdateProfile`).
- `AvatarUploadField.tsx` — Mantine `FileButton`; on pick → `useUploadAttachment({ placement: "public" })` → then `useUpdateProfile({ avatarAttachmentId })`; preview via `useProfile().avatar?.url`.
- `NotificationSettingsSection.tsx` — two `Switch`es (attentionItem / timer); on change → `useUpdateUserSettings` sending BOTH current values (full replace).

**Route**
- `src/routes/_authenticated/settings.tsx` → `createFileRoute("/_authenticated/settings")({ component: SettingsPage })`. (Regenerates `routeTree.gen.ts` — generated, leave it.)

## Changes contained

- `src/profile/models/{profile,userSettings}.ts`
- `src/profile/apis/{fetchProfile,updateProfile,fetchUserSettings,updateUserSettings}.ts`
- `src/profile/hooks/queries/{useProfileQueryData,useProfile,useUserSettingsQueryData,useUserSettings}.ts`
- `src/profile/hooks/mutations/{useUpdateProfile,useUpdateUserSettings}.ts`
- `src/profile/components/{SettingsPage,ProfileSection,AvatarUploadField,NotificationSettingsSection}.tsx`
- `src/routes/_authenticated/settings.tsx`

## Out of scope

- Attachment upload flow internals — consume ST-002's `useUploadAttachment`, don't reimplement.
- Navbar avatar/menu wiring — ST-004 (`src/app/components/Navbar/Navbar.tsx`).
- Editing name/firstName/lastName/email — not supported by API.

## Verification

- Typecheck/build: prompt user (do not run dev).
- Manual at `/settings`: GET `/profile` + `/user-settings` populate; edit phone → PATCH persists on reload;
  upload avatar → preview updates, PATCH carries `avatarAttachmentId`; toggle a switch → PUT `/user-settings`
  with both booleans.

## Implementation output
<!-- FILL AFTER WORK. What was built and key files. Required before in-review/done. -->

## Notes/decisions
<!-- Anything worth recording for reviewers. -->
