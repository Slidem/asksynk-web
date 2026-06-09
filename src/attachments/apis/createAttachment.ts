import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  AttachmentRegisterInput,
  AttachmentUploadGrant,
} from "../models/attachment";

export async function createAttachment(input: AttachmentRegisterInput) {
  const response = await apiFetch(buildApiUrl("/attachments"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to register attachment");
  }

  return response.json() as Promise<AttachmentUploadGrant>;
}
