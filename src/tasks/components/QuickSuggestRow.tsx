import { ActionIcon, Group, TextInput } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useRef, useState } from "react";

import { ConnectionPicker } from "@/network/components/ConnectionPicker";
import { QuickAddShell } from "@/tasks/components/QuickAddShell";
import { useCreateTaskSuggestion } from "@/tasks/hooks/mutations/useCreateTaskSuggestion";

// Collapsed "+ Suggest a task" trigger that reveals an inline recipient + title
// suggest; the full dialog covers description/tags/batch.
export function QuickSuggestRow() {
  const { createTaskSuggestion, isCreating } = useCreateTaskSuggestion();

  const [suggesteeUserId, setSuggesteeUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  const canSubmit = Boolean(suggesteeUserId) && title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || !suggesteeUserId) return;
    createTaskSuggestion({
      suggesteeUserId,
      payload: { kind: "task", title: title.trim() },
    });
    setTitle("");
    titleRef.current?.focus();
  };

  return (
    <QuickAddShell label="Suggest a task">
      <Group gap="xs" wrap="nowrap" align="center">
        <ConnectionPicker
          value={suggesteeUserId}
          onChange={setSuggesteeUserId}
          placeholder="Suggest to..."
          size="xs"
          w={220}
        />
        <TextInput
          ref={titleRef}
          autoFocus
          placeholder="Quick suggest a task..."
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
          aria-label="Send suggestion"
        >
          <IconSend size={14} />
        </ActionIcon>
      </Group>
    </QuickAddShell>
  );
}
