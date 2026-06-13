import {
  Badge,
  Button,
  Group,
  Input,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useState } from "react";

import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { SuggestionChildrenEditor } from "@/tasks/components/SuggestionChildrenEditor";
import {
  useEditTaskSuggestionDialogHandlers,
  useIsEditTaskSuggestionDialogOpened,
  useOnSelectedEditSuggestionChange,
  useOpenedEditSuggestion,
} from "@/tasks/hooks/dialogs/editTaskSuggestionDialogHooks";
import { useEditTaskSuggestion } from "@/tasks/hooks/mutations/useEditTaskSuggestion";
import {
  makeEmptySuggestionChild,
  type SuggestionChildFormValues,
  type SuggestionFormValues,
} from "@/tasks/models/taskForm";
import { suggestionFormValuesToPayloadEditInput } from "@/tasks/utils/suggestionFormMapper";

// Edits a PENDING suggestion's payload (either party). Kind is immutable.
export function TaskSuggestionEditDialog() {
  const isOpened = useIsEditTaskSuggestionDialogOpened();
  const suggestion = useOpenedEditSuggestion();
  const { close } = useEditTaskSuggestionDialogHandlers();
  const { editTaskSuggestion, isEditing } = useEditTaskSuggestion();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [children, setChildren] = useState<SuggestionChildFormValues[]>([
    makeEmptySuggestionChild(),
  ]);

  useOnSelectedEditSuggestionChange((selected) => {
    if (!selected) return;
    const { payload } = selected;
    setTitle(payload.title);
    setDescription(payload.description ?? "");
    setDueDate(payload.dueDate ? new Date(payload.dueDate) : null);
    setTagIds(payload.tagIds);
    setChildren(
      payload.kind === "batch" && payload.tasks.length > 0
        ? payload.tasks.map((t) => ({
            title: t.title,
            description: t.description ?? "",
          }))
        : [makeEmptySuggestionChild()],
    );
  });

  const kind = suggestion?.payload.kind ?? "task";

  const canSubmit =
    title.trim().length > 0 &&
    (kind === "task" || children.some((c) => c.title.trim().length > 0));

  const handleSubmit = () => {
    if (!suggestion || !canSubmit) return;

    const values: SuggestionFormValues = {
      suggesteeUserId: suggestion.suggesteeUserId,
      kind,
      title,
      description,
      dueDate,
      tagIds,
      tasks: children.filter((c) => c.title.trim().length > 0),
    };
    editTaskSuggestion(
      suggestionFormValuesToPayloadEditInput(values, suggestion.id),
    );
    close();
  };

  return (
    <Modal
      opened={isOpened}
      onClose={close}
      title={
        <Group gap="xs">
          Edit suggestion
          {kind === "batch" && (
            <Badge size="xs" variant="light" color="grape">
              Batch
            </Badge>
          )}
        </Group>
      }
      size="lg"
    >
      <Stack gap="sm">
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
          label="Tags"
          description="Tags come from the assignee's tag list"
        >
          <UserTagPicker
            userId={suggestion?.suggesteeUserId}
            selectedTagIds={tagIds}
            onChange={setTagIds}
          />
        </Input.Wrapper>

        {kind === "batch" && (
          <SuggestionChildrenEditor
            children_={children}
            onChange={setChildren}
          />
        )}

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button
            loading={isEditing}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
