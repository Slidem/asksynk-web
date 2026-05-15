import { Accordion, Group, Stack, Switch, Text } from "@mantine/core";
import { IconBell, IconVolume } from "@tabler/icons-react";

import type { TagFormValues } from "@/tags/models/tagForm";
import type { UseFormReturnType } from "@mantine/form";

interface Props {
  form: UseFormReturnType<TagFormValues>;
}

const ACCORDION_VALUE = "notifications";

export function TagNotificationsSection({ form }: Props) {
  return (
    <Accordion.Item value={ACCORDION_VALUE}>
      <Accordion.Control icon={<IconBell size={16} />}>
        Notifications
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="sm" align="center">
              <IconBell size={18} color="var(--mantine-color-dimmed)" />
              <div>
                <Text size="sm">Browser notifications</Text>
                <Text size="xs" c="dimmed">
                  Get notified in your browser
                </Text>
              </div>
            </Group>
            <Switch
              key={form.key("browserNotificationEnabled")}
              {...form.getInputProps("browserNotificationEnabled", {
                type: "checkbox",
              })}
            />
          </Group>
          <Group justify="space-between" align="center">
            <Group gap="sm" align="center">
              <IconVolume size={18} color="var(--mantine-color-dimmed)" />
              <div>
                <Text size="sm">Sound alerts</Text>
                <Text size="xs" c="dimmed">
                  Play a sound on new messages
                </Text>
              </div>
            </Group>
            <Switch
              key={form.key("soundNotificationEnabled")}
              {...form.getInputProps("soundNotificationEnabled", {
                type: "checkbox",
              })}
            />
          </Group>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
