import { createAttachment } from "@/attachments/apis/createAttachment";
import { finalizeAttachment } from "@/attachments/apis/finalizeAttachment";
import { uploadBytes } from "@/attachments/apis/uploadBytes";
import {
  ALLOWED_CONTENT_TYPES,
  MAX_ATTACHMENT_BYTES,
  type AttachmentDto,
  type AttachmentPlacement,
} from "@/attachments/models/attachment";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

interface UploadAttachmentInput {
  file: File;
  placement: AttachmentPlacement;
}

async function uploadAttachment({
  file,
  placement,
}: UploadAttachmentInput): Promise<AttachmentDto> {
  if (!(ALLOWED_CONTENT_TYPES as readonly string[]).includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error("File exceeds the 10 MB limit");
  }

  const grant = await createAttachment({
    placement,
    contentType: file.type,
    fileName: file.name,
    sizeBytes: file.size,
  });

  await uploadBytes(grant.upload, file);

  return finalizeAttachment(grant.attachmentId);
}

export function useUploadAttachment() {
  const mutation = useMutation({
    mutationFn: uploadAttachment,
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Upload failed",
        message: error.message,
      });
    },
  });

  return { upload: mutation.mutateAsync, isUploading: mutation.isPending };
}
