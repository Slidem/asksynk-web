import { ActionIcon, Group, Stack, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRef, useState } from "react";

import { QuickAddShell } from "@/tasks/components/QuickAddShell";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { useCreateTask } from "@/tasks/hooks/mutations/useCreateTask";

// Collapsed "+ Add task" trigger that reveals an inline title + tags create.
export function QuickAddTaskCard() {
  const { createTask, isCreating } = useCreateTask();
  const [title, setTitle] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createTask({ title: title.trim(), tagIds });
    setTitle("");
    setTagIds([]);
    titleRef.current?.focus();
  };

  return (
    <QuickAddShell label="Add task">
      <Stack gap="xs">
        <Group gap="xs" wrap="nowrap">
          <TextInput
            ref={titleRef}
            autoFocus
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
    </QuickAddShell>
  );
}
