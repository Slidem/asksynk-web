import {
  Badge,
  ColorSwatch,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconBolt, IconClock } from "@tabler/icons-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { TagDto } from "@/tags/models/tag";
import classes from "@/messages/tiptap/TagSuggestionList.module.css";

interface Props {
  items: TagDto[];
  command: (tag: TagDto) => void;
}

export interface TagSuggestionListHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const TagSuggestionList = forwardRef<TagSuggestionListHandle, Props>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => setSelectedIndex(0), [items]);

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
            const isImmediate = tag.answerMode.type === "immediately";
            return (
              <UnstyledButton
                key={tag.id}
                onClick={() => select(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`${classes.item} ${selected ? classes.itemSelected : ""}`}
              >
                <ColorSwatch color={tag.color} size={12} />
                <Text size="sm" fw={600} style={{ flex: 1, minWidth: 0 }} truncate>
                  {tag.name}
                </Text>
                <Badge
                  size="xs"
                  variant="light"
                  leftSection={
                    isImmediate ? <IconBolt size={10} /> : <IconClock size={10} />
                  }
                >
                  {isImmediate ? "immediate" : "timeblock"}
                </Badge>
              </UnstyledButton>
            );
          })}
        </Stack>
      </Paper>
    );
  },
);

TagSuggestionList.displayName = "TagSuggestionList";
