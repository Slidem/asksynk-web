import {
  Button,
  Group,
  Input,
  Modal,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useState } from "react";

import { getConnectionDisplayName } from "@/lib/connections";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { SuggestionChildrenEditor } from "@/tasks/components/SuggestionChildrenEditor";
import {
  useCreateTaskSuggestionDialogHandlers,
  useIsCreateTaskSuggestionDialogOpened,
} from "@/tasks/hooks/dialogs/createTaskSuggestionDialogHooks";
import { useCreateTaskSuggestion } from "@/tasks/hooks/mutations/useCreateTaskSuggestion";
import {
  makeEmptySuggestionChild,
  type SuggestionChildFormValues,
  type SuggestionFormValues,
} from "@/tasks/models/taskForm";
import type { SuggestionKind } from "@/tasks/models/taskSuggestion";
import { suggestionFormValuesToCreateInput } from "@/tasks/utils/suggestionFormMapper";

export function TaskSuggestionCreateDialog() {
  const isOpened = useIsCreateTaskSuggestionDialogOpened();
  const { close } = useCreateTaskSuggestionDialogHandlers();
  const { createTaskSuggestion, isCreating } = useCreateTaskSuggestion();
  const { data: connections = [] } = useNetworkConnectionsQuery();

  const [suggesteeUserId, setSuggesteeUserId] = useState<string | null>(null);
  const [kind, setKind] = useState<SuggestionKind>("task");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [children, setChildren] = useState<SuggestionChildFormValues[]>([
    makeEmptySuggestionChild(),
  ]);

  const reset = () => {
    setSuggesteeUserId(null);
    setKind("task");
    setTitle("");
    setDescription("");
    setDueDate(null);
    setTagIds([]);
    setChildren([makeEmptySuggestionChild()]);
  };

  const handleClose = () => {
    reset();
    close();
  };

  // Tags belong to the suggestee; a recipient switch invalidates the picks.
  const handleSuggesteeChange = (value: string | null) => {
    setSuggesteeUserId(value);
    setTagIds([]);
  };

  const canSubmit =
    Boolean(suggesteeUserId) &&
    title.trim().length > 0 &&
    (kind === "task" || children.some((c) => c.title.trim().length > 0));

  const handleSubmit = () => {
    if (!canSubmit || !suggesteeUserId) return;

    const values: SuggestionFormValues = {
      suggesteeUserId,
      kind,
      title,
      description,
      dueDate,
      tagIds,
      tasks: children.filter((c) => c.title.trim().length > 0),
    };
    createTaskSuggestion(suggestionFormValuesToCreateInput(values));
    handleClose();
  };

  const connectionOptions = connections.map((connection) => ({
    value: connection.userId,
    label: getConnectionDisplayName(connection),
  }));

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title="Suggest a task"
      size="lg"
    >
      <Stack gap="sm">
        <Select
          label="Suggest to"
          placeholder="Pick a connection"
          withAsterisk
          data={connectionOptions}
          value={suggesteeUserId}
          onChange={handleSuggesteeChange}
          searchable
        />

        <SegmentedControl
          value={kind}
          onChange={(value) => setKind(value as SuggestionKind)}
          data={[
            { value: "task", label: "Single task" },
            { value: "batch", label: "Batch" },
          ]}
        />

        <TextInput
          label="Title"
          withAsterisk
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <Textarea
          label="Description"
          autosize
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />

        <DateTimePicker
          label={kind === "batch" ? "Due date (whole batch)" : "Due date"}
          clearable
          value={dueDate}
          onChange={(value) => setDueDate(value ? new Date(value) : null)}
        />

        <Input.Wrapper
          label="Their tags"
          description={
            suggesteeUserId
              ? "Hints show their approximate answer time per tag"
              : "Pick a connection to choose from their tags"
          }
        >
          <UserTagPicker
            userId={suggesteeUserId ?? undefined}
            selectedTagIds={tagIds}
            onChange={setTagIds}
            disabled={!suggesteeUserId}
          />
        </Input.Wrapper>

        {kind === "batch" && (
          <SuggestionChildrenEditor
            children_={children}
            onChange={setChildren}
          />
        )}

        {connectionOptions.length === 0 && (
          <Text size="xs" c="dimmed">
            Connect with someone in your network to suggest tasks.
          </Text>
        )}

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={isCreating}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Send suggestion
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
