import { ActionIcon, Group, Paper, Select, TextInput } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";

import { getConnectionDisplayName } from "@/lib/connections";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";
import { useCreateTaskSuggestion } from "@/tasks/hooks/mutations/useCreateTaskSuggestion";

// Inline quick-suggest: recipient + title; the full dialog covers the rest.
export function QuickSuggestRow() {
  const { data: connections = [] } = useNetworkConnectionsQuery();
  const { createTaskSuggestion, isCreating } = useCreateTaskSuggestion();

  const [suggesteeUserId, setSuggesteeUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const canSubmit = Boolean(suggesteeUserId) && title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || !suggesteeUserId) return;
    createTaskSuggestion({
      suggesteeUserId,
      payload: { kind: "task", title: title.trim() },
    });
    setTitle("");
  };

  const connectionOptions = connections.map((connection) => ({
    value: connection.userId,
    label: getConnectionDisplayName(connection),
  }));

  return (
    <Paper withBorder radius="md" p="xs">
      <Group gap="xs" wrap="nowrap">
        <Select
          placeholder="Suggest to..."
          size="xs"
          w={200}
          data={connectionOptions}
          value={suggesteeUserId}
          onChange={setSuggesteeUserId}
          searchable
        />
        <TextInput
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
    </Paper>
  );
}
