import {
  ActionIcon,
  Badge,
  Button,
  Fieldset,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconListCheck, IconPlus, IconTrash } from "@tabler/icons-react";

import {
  makeEmptyTaskChild,
  type TaskChildFormValues,
} from "@/tasks/models/taskForm";

interface Props {
  items: TaskChildFormValues[];
  onChange: (items: TaskChildFormValues[]) => void;
  legend?: string;
}

// Unified editor for batch + suggestion child rows: a clearly-separated section
// of compact inline rows (title + optional description), with add/remove. Tags
// and dueDate live at the batch/suggestion level, not per child.
export function TaskChildrenEditor({
  items,
  onChange,
  legend = "Tasks in batch",
}: Props) {
  const updateChild = (index: number, patch: Partial<TaskChildFormValues>) => {
    onChange(
      items.map((child, i) => (i === index ? { ...child, ...patch } : child)),
    );
  };

  return (
    <Fieldset
      variant="filled"
      radius="md"
      legend={
        <Group gap="xs">
          <IconListCheck size={16} />
          <Text span size="sm" fw={500}>
            {legend}
          </Text>
          <Badge size="sm" variant="light" color="gray">
            {items.length}
          </Badge>
        </Group>
      }
    >
      <Stack gap="xs">
        {items.map((child, index) => (
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
              disabled={items.length === 1}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Remove task"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}

        <Button
          variant="light"
          size="xs"
          leftSection={<IconPlus size={14} />}
          onClick={() => onChange([...items, makeEmptyTaskChild()])}
          style={{ alignSelf: "flex-start" }}
        >
          Add task
        </Button>
      </Stack>
    </Fieldset>
  );
}
