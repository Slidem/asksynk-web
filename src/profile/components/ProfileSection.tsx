import { AvatarUploadField } from "@/profile/components/AvatarUploadField";
import { useProfile } from "@/profile/hooks/queries/useProfile";
import { useUpdateProfile } from "@/profile/hooks/mutations/useUpdateProfile";
import {
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser } from "@tabler/icons-react";
import { useEffect } from "react";

interface ProfileFormValues {
  phone: string;
}

export function ProfileSection() {
  const { data: profile } = useProfile();
  const { updateProfile, isUpdating } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    mode: "uncontrolled",
    initialValues: { phone: "" },
  });

  useEffect(() => {
    if (profile) {
      form.setValues({ phone: profile.phone ?? "" });
      form.resetDirty({ phone: profile.phone ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleSave = () => {
    const phone = form.getValues().phone.trim();
    updateProfile({ phone: phone === "" ? null : phone });
  };

  return (
    <Paper p="lg" radius="lg" shadow="sm" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconUser size={20} />
          <Title order={3}>Profile</Title>
        </Group>

        <AvatarUploadField />

        <Divider />

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput label="Name" value={profile?.name ?? ""} disabled readOnly />
          <TextInput
            label="Email"
            value={profile?.email ?? ""}
            disabled
            readOnly
          />
        </SimpleGrid>

        <Group align="flex-end" gap="md">
          <TextInput
            flex={1}
            label="Phone"
            placeholder="+15551234567"
            key={form.key("phone")}
            {...form.getInputProps("phone")}
          />
          <Button onClick={handleSave} loading={isUpdating}>
            Save
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
