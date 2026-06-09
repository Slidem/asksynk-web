import { apiFetch, buildApiUrl } from "@/lib/api";
import type { AttachmentDto } from "../models/attachment";

export async function getAttachment(attachmentId: string) {
  const response = await apiFetch(buildApiUrl(`/attachments/${attachmentId}`));

  if (!response.ok) {
    throw new Error("Failed to load attachment");
  }

  return response.json() as Promise<AttachmentDto>;
}
