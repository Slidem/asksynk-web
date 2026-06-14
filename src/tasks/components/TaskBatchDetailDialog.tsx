import {
  Badge,
  Button,
  Divider,
  Group,
  Input,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconAlignLeft,
  IconArrowUpRight,
  IconCalendarEvent,
  IconListCheck,
  IconStack2,
  IconTag,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useState } from "react";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { DescriptionEditor } from "@/components/DescriptionEditor";
import { toISOStringWithTimezone } from "@/lib/date";
import { isBlankHtml } from "@/lib/isBlankHtml";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { BatchDeleteButton } from "@/tasks/components/BatchDeleteButton";
import { BatchTaskRow } from "@/tasks/components/BatchTaskRow";
import { CollapsibleSection } from "@/tasks/components/CollapsibleSection";
import type { TaskDto } from "@/tasks/models/task";
import {
  useIsTaskBatchDetailDialogOpened,
  useTaskBatchDetailDialogBatchId,
  useTaskBatchDetailDialogHandlers,
} from "@/tasks/hooks/dialogs/taskBatchDetailDialogHooks";
import { useMoveTaskStatus } from "@/tasks/hooks/mutations/useMoveTaskStatus";
import { useUpdateTaskBatch } from "@/tasks/hooks/mutations/useUpdateTaskBatch";
import { useTaskBatch } from "@/tasks/hooks/queries/useTaskBatch";
import { useTasks } from "@/tasks/hooks/queries/useTasks";

export function TaskBatchDetailDialog() {
  const isOpened = useIsTaskBatchDetailDialogOpened();
  const batchId = useTaskBatchDetailDialogBatchId();
  const { close } = useTaskBatchDetailDialogHandlers();

  const { data: batch } = useTaskBatch(batchId, { enabled: isOpened });
  // Children come from the board's task list cache so optimistic status flips
  // show here and on the board at once.
  const selectChildren = useCallback(
    (tasks: TaskDto[]) => tasks.filter((task) => task.batchId === batchId),
    [batchId],
  );
  const { data: children = [] } = useTasks(selectChildren);

  const { updateTaskBatch, isUpdating } = useUpdateTaskBatch();
  const { moveTaskStatus } = useMoveTaskStatus();
  const isMobile = useIsMobile();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);

  // Prefill once per opened batch; keyed on batch id so refetches (e.g. after
  // a child status change) don't clobber in-progress edits.
  useEffect(() => {
    if (isOpened && batch) {
      setTitle(batch.title);
      setDescription(batch.description ?? "");
      setDueDate(batch.dueDate ? new Date(batch.dueDate) : null);
      setTagIds(batch.tagIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened, batch?.id]);

  const handleSave = () => {
    if (!batchId || !title.trim()) return;
    updateTaskBatch({
      id: batchId,
      title: title.trim(),
      description: isBlankHtml(description) ? null : description,
      dueDate: dueDate ? toISOStringWithTimezone(new Date(dueDate)) : null,
      tagIds,
    });
    close();
  };

  const deleteButton = batchId && (
    <BatchDeleteButton
      batchId={batchId}
      taskCount={children.length}
      onDeleted={close}
      fullWidth={isMobile}
    />
  );

  const openButton = (
    <Button
      variant="light"
      leftSection={<IconArrowUpRight size={16} />}
      fullWidth={isMobile}
      renderRoot={(props) => (
        <Link
          to="/batch/$batchId"
          params={{ batchId: batchId ?? "" }}
          onClick={close}
          {...props}
        />
      )}
    >
      Open full page
    </Button>
  );

  const cancelButton = (
    <Button variant="default" onClick={close} fullWidth={isMobile}>
      Cancel
    </Button>
  );

  const saveButton = (
    <Button
      loading={isUpdating}
      disabled={!title.trim()}
      onClick={handleSave}
      fullWidth={isMobile}
    >
      Save
    </Button>
  );

  return (
    <Modal
      opened={isOpened}
      onClose={close}
      title="Batch details"
      size="lg"
      fullScreen={isMobile}
    >
      <Stack gap="sm">
        <TextInput
          label="Batch title"
          withAsterisk
          leftSection={<IconStack2 size={16} />}
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
              label="Due date"
              clearable
              leftSection={<IconCalendarEvent size={16} />}
              value={dueDate}
              onChange={(value) => setDueDate(value ? new Date(value) : null)}
            />
            <Input.Wrapper
              label={
                <Group gap={4} component="span">
                  <IconTag size={14} />
                  Tags (applied to the whole batch)
                </Group>
              }
            >
              <UserTagPicker selectedTagIds={tagIds} onChange={setTagIds} />
            </Input.Wrapper>
          </Stack>
        </CollapsibleSection>

        <CollapsibleSection
          icon={<IconListCheck size={14} />}
          title="Tasks"
          action={
            <Badge size="sm" variant="light" color="gray">
              {children.length}
            </Badge>
          }
        >
          {children.length === 0 ? (
            <Text size="sm" c="dimmed" fs="italic">
              No tasks yet — open the full page to add some.
            </Text>
          ) : (
            <Stack gap="xs">
              {children.map((task, i) => (
                <Fragment key={task.id}>
                  {i > 0 && <Divider />}
                  <BatchTaskRow
                    task={task}
                    onStatusChange={(status) =>
                      moveTaskStatus({ id: task.id, status })
                    }
                  />
                </Fragment>
              ))}
            </Stack>
          )}
        </CollapsibleSection>

        {isMobile ? (
          <Stack gap="xs" mt="sm">
            {saveButton}
            {cancelButton}
            <Group grow gap="xs">
              {deleteButton}
              {openButton}
            </Group>
          </Stack>
        ) : (
          <Group justify="space-between" mt="sm">
            <Group gap="xs">
              {deleteButton}
              {openButton}
            </Group>
            <Group gap="xs">
              {cancelButton}
              {saveButton}
            </Group>
          </Group>
        )}
      </Stack>
    </Modal>
  );
}
