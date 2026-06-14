import {
  Badge,
  Button,
  Group,
  Input,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconAlignLeft,
  IconCalendarEvent,
  IconForms,
  IconListCheck,
  IconTag,
} from "@tabler/icons-react";
import { useState } from "react";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { DescriptionEditor } from "@/components/DescriptionEditor";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { CollapsibleSection } from "@/tasks/components/CollapsibleSection";
import { TaskChildrenEditor } from "@/tasks/components/TaskChildrenEditor";
import {
  useEditTaskSuggestionDialogHandlers,
  useIsEditTaskSuggestionDialogOpened,
  useOnSelectedEditSuggestionChange,
  useOpenedEditSuggestion,
} from "@/tasks/hooks/dialogs/editTaskSuggestionDialogHooks";
import { useEditTaskSuggestion } from "@/tasks/hooks/mutations/useEditTaskSuggestion";
import {
  makeEmptyTaskChild,
  type SuggestionFormValues,
  type TaskChildFormValues,
} from "@/tasks/models/taskForm";
import { suggestionFormValuesToPayloadEditInput } from "@/tasks/utils/suggestionFormMapper";

// Edits a PENDING suggestion's payload (either party). Kind is immutable.
export function TaskSuggestionEditDialog() {
  const isOpened = useIsEditTaskSuggestionDialogOpened();
  const suggestion = useOpenedEditSuggestion();
  const { close } = useEditTaskSuggestionDialogHandlers();
  const { editTaskSuggestion, isEditing } = useEditTaskSuggestion();
  const isMobile = useIsMobile();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [children, setChildren] = useState<TaskChildFormValues[]>([
    makeEmptyTaskChild(),
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
        : [makeEmptyTaskChild()],
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
      fullScreen={isMobile}
    >
      <Stack gap="sm">
        <TextInput
          label="Title"
          withAsterisk
          leftSection={<IconForms size={16} />}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <CollapsibleSection icon={<IconAlignLeft size={14} />} title="Description">
          <DescriptionEditor content={description} onChange={setDescription} />
        </CollapsibleSection>

        <CollapsibleSection
          icon={<IconCalendarEvent size={14} />}
          title="Due date & tags"
        >
          <Stack gap="sm">
            <DateTimePicker
              label={kind === "batch" ? "Due date (whole batch)" : "Due date"}
              clearable
              leftSection={<IconCalendarEvent size={16} />}
              value={dueDate}
              onChange={(value) => setDueDate(value ? new Date(value) : null)}
            />
            <Input.Wrapper
              label={
                <Group gap={4} component="span">
                  <IconTag size={14} />
                  Tags
                </Group>
              }
              description="Tags come from the assignee's tag list"
            >
              <UserTagPicker
                userId={suggestion?.suggesteeUserId}
                selectedTagIds={tagIds}
                onChange={setTagIds}
              />
            </Input.Wrapper>
          </Stack>
        </CollapsibleSection>

        {kind === "batch" && (
          <CollapsibleSection
            icon={<IconListCheck size={14} />}
            title="Tasks"
            action={
              <Badge size="sm" variant="light" color="gray">
                {children.length}
              </Badge>
            }
          >
            <TaskChildrenEditor
              items={children}
              onChange={setChildren}
              hideHeader
            />
          </CollapsibleSection>
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
