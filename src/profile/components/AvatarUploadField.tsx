import { useUploadAttachment } from "@/attachments/hooks/useUploadAttachment";
import { useProfile } from "@/profile/hooks/queries/useProfile";
import { useUpdateProfile } from "@/profile/hooks/mutations/useUpdateProfile";
import { Avatar, Button, FileButton, Group, Stack, Text } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";

export function AvatarUploadField() {
  const { data: profile } = useProfile();
  const { upload, isUploading } = useUploadAttachment();
  const { updateProfile, isUpdating } = useUpdateProfile();

  const busy = isUploading || isUpdating;
  const previewUrl = profile?.image ?? undefined;

  async function handlePick(file: File | null) {
    if (!file) return;
    const attachment = await upload({ file, placement: "public" });
    await updateProfile({ avatarAttachmentId: attachment.id });
  }

  return (
    <Group gap="md" wrap="nowrap">
      <Avatar src={previewUrl} radius="xl" size={72} />
      <Stack gap={4}>
        <FileButton onChange={handlePick} accept="image/png,image/jpeg,image/webp,image/gif">
          {(props) => (
            <Button
              {...props}
              variant="light"
              size="xs"
              loading={busy}
              leftSection={<IconCamera size={16} />}
            >
              Change avatar
            </Button>
          )}
        </FileButton>
        <Text size="xs" c="dimmed">
          PNG, JPG, WEBP or GIF, up to 10 MB.
        </Text>
      </Stack>
    </Group>
  );
}
