import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import {
  makeEmptySuggestionChild,
  type SuggestionChildFormValues,
} from "@/tasks/models/taskForm";

interface Props {
  children_: SuggestionChildFormValues[];
  onChange: (children: SuggestionChildFormValues[]) => void;
}

// Batch suggestion children: title (+ optional description) only — tags and
// dueDate live at suggestion level.
export function SuggestionChildrenEditor({ children_, onChange }: Props) {
  const updateChild = (
    index: number,
    patch: Partial<SuggestionChildFormValues>,
  ) => {
    onChange(
      children_.map((child, i) =>
        i === index ? { ...child, ...patch } : child,
      ),
    );
  };

  return (
    <Stack gap="xs">
      <Divider label="Tasks in batch" labelPosition="left" />
      {children_.map((child, index) => (
        <Group key={index} gap="xs" align="center" wrap="nowrap">
          <TextInput
            placeholder="Task title"
            value={child.title}
            onChange={(e) =>
              updateChild(index, { title: e.currentTarget.value })
            }
            style={{ flex: 1 }}
          />
          <TextInput
            placeholder="Description (optional)"
            value={child.description}
            onChange={(e) =>
              updateChild(index, { description: e.currentTarget.value })
            }
            style={{ flex: 1 }}
          />
          <ActionIcon
            variant="subtle"
            color="red"
            disabled={children_.length === 1}
            onClick={() => onChange(children_.filter((_, i) => i !== index))}
            aria-label="Remove task"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ))}
      <Button
        variant="subtle"
        size="xs"
        leftSection={<IconPlus size={14} />}
        onClick={() => onChange([...children_, makeEmptySuggestionChild()])}
      >
        Add task
      </Button>
    </Stack>
  );
}
