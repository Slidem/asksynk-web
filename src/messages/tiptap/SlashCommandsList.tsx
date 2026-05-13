import type { SlashCommandItem } from "@/messages/tiptap/SlashCommandItem";
import classes from "@/messages/tiptap/SlashCommandsList.module.css";
import { Paper, Stack, Text, UnstyledButton } from "@mantine/core";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Props {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export interface SlashCommandsListHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const SlashCommandsList = forwardRef<SlashCommandsListHandle, Props>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const select = (index: number) => {
      const item = items[index];
      if (item) command(item);
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: (event) => {
        if (items.length === 0) return false;
        if (event.key === "ArrowUp") {
          setSelectedIndex((i) => (i + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelectedIndex((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          select(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <Paper shadow="md" radius="md" p="xs" withBorder>
          <Text size="xs" c="dimmed">
            No commands
          </Text>
        </Paper>
      );
    }

    return (
      <Paper shadow="md" radius="md" withBorder className={classes.root}>
        <Stack gap={2} p={4}>
          {items.map((item, idx) => {
            const Icon = item.icon;
            const selected = idx === selectedIndex;
            return (
              <UnstyledButton
                key={item.id}
                onClick={() => select(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`${classes.item} ${selected ? classes.itemSelected : ""}`}
              >
                <Icon size={16} />
                <div>
                  <Text size="sm" fw={600}>
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text size="xs" c="dimmed">
                      {item.subtitle}
                    </Text>
                  )}
                </div>
              </UnstyledButton>
            );
          })}
        </Stack>
      </Paper>
    );
  },
);

SlashCommandsList.displayName = "SlashCommandsList";
