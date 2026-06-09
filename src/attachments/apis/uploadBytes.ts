import type { AttachmentUploadGrant } from "../models/attachment";

export async function uploadBytes(
  upload: AttachmentUploadGrant["upload"],
  file: File,
) {
  const form = new FormData();
  Object.entries(upload.fields).forEach(([key, value]) => {
    form.append(key, value);
  });
  form.append("file", file);

  const response = await fetch(upload.url, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
}
