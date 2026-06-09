export type AttachmentPlacement = "public" | "message";

export const ALLOWED_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const MAX_ATTACHMENT_BYTES = 10485760;

export interface AttachmentRegisterInput {
  placement: AttachmentPlacement;
  contentType: string;
  fileName?: string;
  sizeBytes: number;
}

export interface AttachmentUploadGrant {
  attachmentId: string;
  storageKey: string;
  upload: {
    url: string;
    fields: Record<string, string>;
    expiresAt: string;
  };
}

export interface AttachmentDto {
  id: string;
  contentType: string;
  fileName: string;
  sizeBytes: number;
  url: string;
  expiresAt: string | null;
}
