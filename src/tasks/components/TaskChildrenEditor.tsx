import {
  Badge,
  Button,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconListCheck, IconPlus } from "@tabler/icons-react";
import { Fragment, useState } from "react";

import { TaskChildRow } from "@/tasks/components/TaskChildRow";
import {
  makeEmptyTaskChild,
  type TaskChildFormValues,
} from "@/tasks/models/taskForm";

interface Props {
  items: TaskChildFormValues[];
  onChange: (items: TaskChildFormValues[]) => void;
  legend?: string;
  // Omit the built-in header when the editor sits inside a CollapsibleSection
  // that already supplies the title + count.
  hideHeader?: boolean;
}

// Unified editor for batch + suggestion child rows. Flat: a plain header (no
// Fieldset border), compact one-line rows separated by dividers, capped +
// scrollable so the dialog stays small.
export function TaskChildrenEditor({
  items,
  onChange,
  legend = "Tasks in batch",
  hideHeader = false,
}: Props) {
  // Index of the row to focus next (set when a row is appended via Enter / button).
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const updateChild = (index: number, patch: Partial<TaskChildFormValues>) => {
    onChange(
      items.map((child, i) => (i === index ? { ...child, ...patch } : child)),
    );
  };

  const addAt = (index: number) => {
    const next = [...items];
    next.splice(index, 0, makeEmptyTaskChild());
    onChange(next);
    setFocusIndex(index);
  };

  return (
    <Stack gap="xs">
      {!hideHeader && (
        <Group gap="xs">
          <IconListCheck size={16} />
          <Text size="sm" fw={500}>
            {legend}
          </Text>
          <Badge size="sm" variant="light" color="gray">
            {items.length}
          </Badge>
        </Group>
      )}

      <ScrollArea.Autosize mah={360} type="auto" offsetScrollbars>
        <Stack gap="xs">
          {items.map((child, index) => (
            <Fragment key={index}>
              {index > 0 && <Divider />}
              <TaskChildRow
                child={child}
                canRemove={items.length > 1}
                autoFocus={index === focusIndex}
                onEnter={() => addAt(index + 1)}
                onFocused={() => setFocusIndex(null)}
                onChange={(patch) => updateChild(index, patch)}
                onRemove={() => onChange(items.filter((_, i) => i !== index))}
              />
            </Fragment>
          ))}
        </Stack>
      </ScrollArea.Autosize>

      <Button
        variant="light"
        size="xs"
        leftSection={<IconPlus size={14} />}
        onClick={() => addAt(items.length)}
        style={{ alignSelf: "flex-start" }}
      >
        Add task
      </Button>
    </Stack>
  );
}
