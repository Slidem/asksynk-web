import { Center, Stack, Text } from "@mantine/core";
import { IconChecklist } from "@tabler/icons-react";

interface Props {
  message?: string;
}

export function TasksEmptyState({ message = "No tasks yet" }: Props) {
  return (
    <Center py="xl">
      <Stack align="center" gap="xs">
        <IconChecklist size={32} color="var(--mantine-color-gray-5)" />
        <Text c="dimmed" size="sm">
          {message}
        </Text>
      </Stack>
    </Center>
  );
}
