import {
  Button,
  Divider,
  Group,
  Input,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

import { toISOStringWithTimezone } from "@/lib/date";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  type TaskDto,
  type TaskStatus,
} from "@/tasks/models/task";
import { useCreateTaskDialogHandlers } from "@/tasks/hooks/dialogs/createTaskDialogHooks";
import {
  useIsTaskBatchDetailDialogOpened,
  useTaskBatchDetailDialogBatchId,
  useTaskBatchDetailDialogHandlers,
} from "@/tasks/hooks/dialogs/taskBatchDetailDialogHooks";
import { useMoveTaskStatus } from "@/tasks/hooks/mutations/useMoveTaskStatus";
import { useUpdateTaskBatch } from "@/tasks/hooks/mutations/useUpdateTaskBatch";
import { useTaskBatch } from "@/tasks/hooks/queries/useTaskBatch";
import { useTasks } from "@/tasks/hooks/queries/useTasks";

const STATUS_OPTIONS = TASK_STATUS_ORDER.map((status) => ({
  value: status,
  label: TASK_STATUS_LABELS[status],
}));

export function TaskBatchDetailDialog() {
  const isOpened = useIsTaskBatchDetailDialogOpened();
  const batchId = useTaskBatchDetailDialogBatchId();
  const { close } = useTaskBatchDetailDialogHandlers();
  const { open: openCreateTask } = useCreateTaskDialogHandlers();

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
      description: description.trim() || null,
      dueDate: dueDate ? toISOStringWithTimezone(new Date(dueDate)) : null,
      tagIds,
    });
    close();
  };

  return (
    <Modal
      opened={isOpened}
      onClose={close}
      title="Batch details"
      size="lg"
    >
      <Stack gap="sm">
        <TextInput
          label="Batch title"
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
          label="Due date"
          clearable
          value={dueDate}
          onChange={(value) => setDueDate(value ? new Date(value) : null)}
        />
        <Input.Wrapper label="Tags (applied to the whole batch)">
          <UserTagPicker selectedTagIds={tagIds} onChange={setTagIds} />
        </Input.Wrapper>

        <Divider label="Tasks" labelPosition="left" />

        {children.map((task) => (
          <Paper key={task.id} withBorder radius="md" p="sm">
            <Group justify="space-between" wrap="nowrap" gap="sm">
              <Text size="sm" style={{ minWidth: 0 }} truncate>
                {task.title}
              </Text>
              <Select
                size="xs"
                w={140}
                data={STATUS_OPTIONS}
                allowDeselect={false}
                value={task.status}
                onChange={(value) => {
                  if (value && value !== task.status) {
                    moveTaskStatus({ id: task.id, status: value as TaskStatus });
                  }
                }}
              />
            </Group>
          </Paper>
        ))}

        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconPlus size={14} />}
          onClick={() => batchId && openCreateTask(batchId)}
        >
          Add task
        </Button>

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button
            loading={isUpdating}
            disabled={!title.trim()}
            onClick={handleSave}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
