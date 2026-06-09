import { apiFetch, buildApiUrl } from "@/lib/api";
import type { AttachmentDto } from "../models/attachment";

export async function finalizeAttachment(attachmentId: string) {
  const response = await apiFetch(
    buildApiUrl(`/attachments/${attachmentId}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "ready" }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to finalize attachment");
  }

  return response.json() as Promise<AttachmentDto>;
}
