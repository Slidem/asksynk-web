import classes from "@/messages/tiptap/TagSuggestionList.module.css";
import { TagAvailabilityHint } from "@/tags/components/TagAvailabilityHint";
import type { TagDto } from "@/tags/models/tag";
import {
  ColorSwatch,
  Paper,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Props {
  items: TagDto[];
  command: (tag: TagDto) => void;
  userId?: string | null;
}

export interface TagSuggestionListHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const TagSuggestionList = forwardRef<TagSuggestionListHandle, Props>(
  ({ items, command, userId }, ref) => {
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
            No tags
          </Text>
        </Paper>
      );
    }

    return (
      <Paper shadow="md" radius="md" withBorder className={classes.root}>
        <Stack gap={2} p={4}>
          {items.map((tag, idx) => {
            const selected = idx === selectedIndex;
            return (
              <UnstyledButton
                key={tag.id}
                onClick={() => select(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`${classes.item} ${selected ? classes.itemSelected : ""}`}
              >
                <ColorSwatch color={tag.color} size={12} />
                <Text
                  size="sm"
                  fw={600}
                  style={{ flex: 1, minWidth: 0 }}
                  truncate
                >
                  {tag.name}
                </Text>
                <Tooltip label="Approximate answer time" withArrow>
                  <span style={{ display: "inline-flex" }}>
                    <TagAvailabilityHint
                      tag={tag}
                      userId={userId ?? undefined}
                    />
                  </span>
                </Tooltip>
              </UnstyledButton>
            );
          })}
        </Stack>
      </Paper>
    );
  },
);

TagSuggestionList.displayName = "TagSuggestionList";
