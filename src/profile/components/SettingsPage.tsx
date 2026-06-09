import { NotificationSettingsSection } from "@/profile/components/NotificationSettingsSection";
import { ProfileSection } from "@/profile/components/ProfileSection";
import { Container, Group, Stack, Title } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

export function SettingsPage() {
  return (
    <Container size="md" maw={760} w="100%" py="lg">
      <Stack gap="lg">
        <Group gap="xs">
          <IconSettings size={26} />
          <Title order={2}>Settings</Title>
        </Group>

        <ProfileSection />
        <NotificationSettingsSection />
      </Stack>
    </Container>
  );
}
