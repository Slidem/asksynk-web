import {
  Badge,
  Box,
  Chip,
  Collapse,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronDown, IconTag } from "@tabler/icons-react";
import { useState } from "react";

import type { TagDto } from "@/tags/models/tag";

interface Props {
  tags: TagDto[];
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
}

export function CalendarTagFilter({ tags, selectedTagIds, onChange }: Props) {
  const [opened, setOpened] = useState(true);

  if (tags.length === 0) return null;

  return (
    <Box px="md" pb={opened ? "xs" : 0}>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        style={{ width: "100%" }}
      >
        <Group gap={5} py={5}>
          <IconTag size={12} color="var(--mantine-color-dimmed)" />
          <Text size="xs" c="dimmed" fw={500}>
            Tags
          </Text>
          {selectedTagIds.length > 0 && (
            <Badge size="xs" variant="light" radius="xl">
              {selectedTagIds.length}
            </Badge>
          )}
          <IconChevronDown
            size={12}
            color="var(--mantine-color-dimmed)"
            style={{
              transform: opened ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms ease",
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        <Group gap={6} pt={4}>
          <Chip.Group multiple value={selectedTagIds} onChange={onChange}>
            <Group gap={6}>
              {tags.map((tag) => (
                <Chip
                  key={tag.id}
                  value={tag.id}
                  size="xs"
                  variant="outline"
                  icon={
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: tag.color,
                        flexShrink: 0,
                      }}
                    />
                  }
                >
                  {tag.name}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
        </Group>
      </Collapse>
    </Box>
  );
}
