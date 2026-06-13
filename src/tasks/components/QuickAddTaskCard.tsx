import { ActionIcon, Group, Paper, Stack, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { useCreateTask } from "@/tasks/hooks/mutations/useCreateTask";

// Inline quick-create in the "To do" column: title + tags only.
export function QuickAddTaskCard() {
  const { createTask, isCreating } = useCreateTask();
  const [title, setTitle] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createTask({ title: title.trim(), tagIds });
    setTitle("");
    setTagIds([]);
  };

  return (
    <Paper withBorder radius="md" p="xs" bg="var(--mantine-color-gray-0)">
      <Stack gap="xs">
        <Group gap="xs" wrap="nowrap">
          <TextInput
            placeholder="Quick add a task..."
            size="xs"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            style={{ flex: 1 }}
          />
          <ActionIcon
            size="md"
            loading={isCreating}
            disabled={!canSubmit}
            onClick={handleSubmit}
            aria-label="Add task"
          >
            <IconPlus size={14} />
          </ActionIcon>
        </Group>
        <UserTagPicker selectedTagIds={tagIds} onChange={setTagIds} />
      </Stack>
    </Paper>
  );
}
