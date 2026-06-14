import { Box, Collapse, Group, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

// Lightweight dialog section: a chevron header above a thin top border that
// toggles a Collapse. No Card border — children (editor/picker) keep their own.
export function CollapsibleSection({
  icon,
  title,
  action,
  defaultOpen = true,
  children,
}: Props) {
  const [opened, { toggle }] = useDisclosure(defaultOpen);

  return (
    <Box style={{ borderTop: "1px solid var(--mantine-color-default-border)" }} pt="xs">
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <UnstyledButton onClick={toggle} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" wrap="nowrap">
            {opened ? (
              <IconChevronDown size={14} />
            ) : (
              <IconChevronRight size={14} />
            )}
            {icon}
            <Text fw={500} size="sm">
              {title}
            </Text>
          </Group>
        </UnstyledButton>
        {action}
      </Group>
      <Collapse in={opened}>
        <Box pt="xs">{children}</Box>
      </Collapse>
    </Box>
  );
}
