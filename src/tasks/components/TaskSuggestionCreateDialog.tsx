import {
  Badge,
  Button,
  Group,
  Input,
  Modal,
  SegmentedControl,
  Stack,
  Text,
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
import { ConnectionPicker } from "@/network/components/ConnectionPicker";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { CollapsibleSection } from "@/tasks/components/CollapsibleSection";
import { TaskChildrenEditor } from "@/tasks/components/TaskChildrenEditor";
import {
  useCreateTaskSuggestionDialogHandlers,
  useIsCreateTaskSuggestionDialogOpened,
  useOnCreateSuggestionPresetChange,
} from "@/tasks/hooks/dialogs/createTaskSuggestionDialogHooks";
import { useCreateTaskSuggestion } from "@/tasks/hooks/mutations/useCreateTaskSuggestion";
import {
  makeEmptyTaskChild,
  type SuggestionFormValues,
  type TaskChildFormValues,
} from "@/tasks/models/taskForm";
import type { SuggestionKind } from "@/tasks/models/taskSuggestion";
import { suggestionFormValuesToCreateInput } from "@/tasks/utils/suggestionFormMapper";

export function TaskSuggestionCreateDialog() {
  const isOpened = useIsCreateTaskSuggestionDialogOpened();
  const { close } = useCreateTaskSuggestionDialogHandlers();
  const { createTaskSuggestion, isCreating } = useCreateTaskSuggestion();
  const { data: connections = [] } = useNetworkConnectionsQuery();
  const isMobile = useIsMobile();

  const [suggesteeUserId, setSuggesteeUserId] = useState<string | null>(null);
  const [kind, setKind] = useState<SuggestionKind>("task");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [children, setChildren] = useState<TaskChildFormValues[]>([
    makeEmptyTaskChild(),
  ]);

  const reset = () => {
    setSuggesteeUserId(null);
    setKind("task");
    setTitle("");
    setDescription("");
    setDueDate(null);
    setTagIds([]);
    setChildren([makeEmptyTaskChild()]);
  };

  // Populate synchronously on open; preset preselects connection + their tags.
  useOnCreateSuggestionPresetChange((preset) => {
    if (!preset) return;
    setSuggesteeUserId(preset.suggesteeUserId ?? null);
    setKind("task");
    setTitle("");
    setDescription("");
    setDueDate(null);
    setTagIds(preset.tagIds ?? []);
    setChildren([makeEmptyTaskChild()]);
  });

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

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title="Suggest a task"
      size="lg"
      fullScreen={isMobile}
    >
      <Stack gap="sm">
        <ConnectionPicker
          label="Suggest to"
          placeholder="Pick a connection"
          withAsterisk
          value={suggesteeUserId}
          onChange={handleSuggesteeChange}
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
                  Their tags
                </Group>
              }
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

        {connections.length === 0 && (
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
