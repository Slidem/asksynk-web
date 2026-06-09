---
id: ST-002
task: add-user-profile-and-settings
title: Attachments presigned-upload module
status: todo
source: backend-api-specs
depends_on: []
owns:
  - src/attachments
branch: feat/ST-002-attachments-presigned-upload-module
created: 2026-06-09
---

## Context

Reusable presigned-upload infra. Backend (note `backend-api-specs`) exposes a 3-step
direct-to-storage flow. ST-003 (avatar upload) consumes this; built standalone so it has
no feature deps. Avatars use `placement: "public"` (stable url, `expiresAt: null`).

## Plan

Follow canonical layout (`src/tags/`): one fn per api file, `apiFetch`/`buildApiUrl` from
`@/lib/api`, throw on `!response.ok`, return `response.json() as Promise<T>`.

- `models/attachment.ts`
  - `AttachmentPlacement = "public" | "message"`
  - `AttachmentRegisterInput { placement; contentType; fileName?; sizeBytes }`
  - `AttachmentUploadGrant { attachmentId; storageKey; upload: { url; fields: Record<string,string>; expiresAt } }`
  - `AttachmentDto { id; contentType; fileName; sizeBytes; url; expiresAt: string | null }`
  - `ALLOWED_CONTENT_TYPES` const + `MAX_ATTACHMENT_BYTES = 10485760`.
- `apis/createAttachment.ts` — `POST /attachments`, body = register input → `AttachmentUploadGrant`.
- `apis/finalizeAttachment.ts` — `PATCH /attachments/:id`, body `{ status: "ready" }` → `AttachmentDto`.
- `apis/getAttachment.ts` — `GET /attachments/:id` → `AttachmentDto` (refresh signed urls; thin, may stay unused by ST-003).
- `apis/uploadBytes.ts` — raw `fetch` (NOT `apiFetch`) multipart POST to `grant.upload.url`:
  append every `grant.upload.fields` entry first, then `file` last; no credentials/auth headers; throw on `!ok`.
- `hooks/useUploadAttachment.ts` — `useMutation` orchestrating register → uploadBytes → finalize;
  input `{ file: File; placement }`; derive `contentType`/`sizeBytes`/`fileName` from `File`;
  validate type ∈ allowed and size ≤ max before register (throw early); returns `AttachmentDto`.
  Expose `{ upload, isUploading }`. Mantine `notifications.show` on error.

## Changes contained

- `src/attachments/models/attachment.ts`
- `src/attachments/apis/{createAttachment,finalizeAttachment,getAttachment,uploadBytes}.ts`
- `src/attachments/hooks/useUploadAttachment.ts`

## Out of scope

- `/profile` PATCH with `avatarAttachmentId` — ST-003.
- Any UI / avatar rendering — ST-003 / ST-004.
- Message attachments — not in T-005.

## Verification

- Typecheck: prompt user for `pnpm tsc` / build (do not run dev).
- Manual: from ST-003 avatar picker, upload an image → network shows POST `/attachments`,
  multipart POST to storage url, PATCH `/attachments/:id` → returns `{ id, url }`.

## Implementation output
<!-- FILL AFTER WORK. What was built and key files. Required before in-review/done. -->

## Notes/decisions
<!-- Anything worth recording for reviewers. -->
