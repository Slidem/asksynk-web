import { Button, Group, Input, Modal, Stack, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconCalendarEvent,
  IconClipboardList,
  IconForms,
  IconTag,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { CollapsibleSection } from "@/tasks/components/CollapsibleSection";
import { TaskChildrenEditor } from "@/tasks/components/TaskChildrenEditor";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import {
  makeEmptyTaskChild,
  type TaskChildFormValues,
} from "@/tasks/models/taskForm";
import { toISOStringWithTimezone } from "@/lib/date";
import type { TaskSuggestionDraft } from "@/messages/models/taskSuggestionDraft";

interface Props {
  opened: boolean;
  /** Suggestee, whose tags the batch is tagged with. */
  recipientUserId: string;
  initialDraft: TaskSuggestionDraft | null;
  onConfirm: (draft: TaskSuggestionDraft) => void;
  onClose: () => void;
}

// Lightweight in-composer batch suggestion editor (no connection picker — the
// suggestee is fixed = the thread recipient). Confirms into a marker; the
// suggestion is created when the message is sent.
export function TaskSuggestionQuickAdd({
  opened,
  recipientUserId,
  initialDraft,
  onConfirm,
  onClose,
}: Props) {
  const isMobile = useIsMobile();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [children, setChildren] = useState<TaskChildFormValues[]>([
    makeEmptyTaskChild(),
  ]);

  // Seed synchronously when the dialog opens (new or editing an existing marker).
  useEffect(() => {
    if (!opened) return;
    setTitle(initialDraft?.title ?? "");
    setDueDate(initialDraft?.dueDate ? new Date(initialDraft.dueDate) : null);
    setTagIds(initialDraft?.tagIds ?? []);
    setChildren(
      initialDraft && initialDraft.tasks.length > 0
        ? initialDraft.tasks
        : [makeEmptyTaskChild()],
    );
  }, [opened, initialDraft]);

  const canSubmit =
    title.trim().length > 0 &&
    children.some((c) => c.title.trim().length > 0);

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm({
      title: title.trim(),
      description: "",
      dueDate: dueDate ? toISOStringWithTimezone(new Date(dueDate)) : null,
      tagIds,
      tasks: children.filter((c) => c.title.trim().length > 0),
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Suggest tasks"
      size="lg"
      fullScreen={isMobile}
    >
      <Stack gap="sm">
        <TextInput
          label="Batch title"
          withAsterisk
          leftSection={<IconForms size={16} />}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />

        <CollapsibleSection
          icon={<IconClipboardList size={14} />}
          title="Tasks"
          defaultOpen
        >
          <TaskChildrenEditor items={children} onChange={setChildren} hideHeader />
        </CollapsibleSection>

        <CollapsibleSection
          icon={<IconCalendarEvent size={14} />}
          title="Due date & tags"
          defaultOpen={false}
        >
          <Stack gap="sm">
            <DateTimePicker
              label="Due date (whole batch)"
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
              description="Hints show their approximate answer time per tag"
            >
              <UserTagPicker
                userId={recipientUserId}
                selectedTagIds={tagIds}
                onChange={setTagIds}
              />
            </Input.Wrapper>
          </Stack>
        </CollapsibleSection>

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!canSubmit} onClick={handleConfirm}>
            Add to message
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
