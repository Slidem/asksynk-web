import { ActionIcon, Button, Group, Paper, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconX } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

// Collapsed: a subtle dashed "+ {label}" trigger. Expanded: reveals the inline
// form in a theme-default surface (dark-theme safe), closing on Escape or the X.
// Children mount only when expanded, so the inner title input can autoFocus.
export function QuickAddShell({ label, children }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  if (!opened) {
    return (
      <Button
        variant="default"
        justify="flex-start"
        fullWidth
        leftSection={<IconPlus size={16} />}
        onClick={open}
        styles={{ root: { borderStyle: "dashed" } }}
      >
        {label}
      </Button>
    );
  }

  return (
    <Paper
      withBorder
      radius="md"
      p="xs"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <Group justify="space-between" mb="xs" wrap="nowrap">
        <Text size="xs" c="dimmed" fw={500}>
          {label}
        </Text>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={close}
          aria-label="Close"
        >
          <IconX size={14} />
        </ActionIcon>
      </Group>
      {children}
    </Paper>
  );
}
