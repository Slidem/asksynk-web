import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Group,
  Input,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconAlignLeft,
  IconArrowLeft,
  IconCalendarDue,
  IconCalendarEvent,
  IconForms,
  IconListDetails,
  IconPencil,
  IconProgressCheck,
  IconStack2,
  IconTag,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";

import { DescriptionEditor } from "@/components/DescriptionEditor";
import { RichTextContent } from "@/components/RichTextContent";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";
import { DetailSection } from "@/tasks/components/DetailSection";
import { STATUS_OPTIONS } from "@/tasks/components/BatchTaskRow";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { useTask } from "@/tasks/hooks/queries/useTask";
import { useMoveTaskStatus } from "@/tasks/hooks/mutations/useMoveTaskStatus";
import { useUpdateTask } from "@/tasks/hooks/mutations/useUpdateTask";
import type { TaskStatus } from "@/tasks/models/task";
import { taskFormValuesToUpdateInput } from "@/tasks/utils/taskFormMapper";

interface Props {
  taskId: string;
}

export function TaskDetailPage({ taskId }: Props) {
  const { data: task, isLoading } = useTask(taskId);
  const { updateTask, isUpdating } = useUpdateTask();
  const { moveTaskStatus } = useMoveTaskStatus();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);

  if (isLoading) {
    return (
      <Container size="md" maw={820} w="100%" py="lg">
        <Loader />
      </Container>
    );
  }

  if (!task) {
    return (
      <Container size="md" maw={820} w="100%" py="lg">
        <Stack gap="sm">
          <Text c="dimmed">Task not found.</Text>
          <Anchor
            renderRoot={(props) => (
              <Link to="/tasks" search={{ tab: "my-tasks" }} {...props} />
            )}
          >
            Back to tasks
          </Anchor>
        </Stack>
      </Container>
    );
  }

  const batched = Boolean(task.batchId);

  const startEditing = () => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setTagIds(task.tagIds);
    setEditing(true);
  };

  const save = () => {
    if (!title.trim()) return;
    updateTask(
      taskFormValuesToUpdateInput(
        {
          title,
          description,
          status,
          dueDate,
          tagIds,
          batchId: task.batchId ?? undefined,
        },
        task.id,
      ),
    );
    setEditing(false);
  };

  return (
    <Container size="md" maw={820} w="100%" py="lg">
      <Stack gap="lg">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <Tooltip label="Back to tasks" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                aria-label="Back to tasks"
                renderRoot={(props) => (
                  <Link
                    to="/tasks"
                    search={{ tab: "my-tasks", focusTaskId: task.id }}
                    {...props}
                  />
                )}
              >
                <IconArrowLeft size={18} />
              </ActionIcon>
            </Tooltip>
            <Title order={3} lineClamp={2} style={{ minWidth: 0 }}>
              {task.title}
            </Title>
          </Group>
          {editing ? (
            <Group gap="xs" wrap="nowrap">
              <Button variant="default" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button loading={isUpdating} disabled={!title.trim()} onClick={save}>
                Save
              </Button>
            </Group>
          ) : (
            <Button
              variant="default"
              leftSection={<IconPencil size={16} />}
              onClick={startEditing}
            >
              Edit
            </Button>
          )}
        </Group>

        {batched && (
          <Anchor
            size="sm"
            renderRoot={(props) => (
              <Link
                to="/batch/$batchId"
                params={{ batchId: task.batchId as string }}
                {...props}
              />
            )}
          >
            <Group gap={4} component="span">
              <IconStack2 size={14} />
              Part of a batch — open batch
            </Group>
          </Anchor>
        )}

        <DetailSection icon={<IconListDetails size={16} />} title="Overview">
          {editing ? (
            <Stack gap="sm">
              <TextInput
                placeholder="Task title"
                leftSection={<IconForms size={16} />}
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
              {!batched && (
                <>
                  <Input.Wrapper
                    label={
                      <Group gap={4} component="span">
                        <IconTag size={14} />
                        Tags
                      </Group>
                    }
                  >
                    <UserTagPicker selectedTagIds={tagIds} onChange={setTagIds} />
                  </Input.Wrapper>
                  <DateTimePicker
                    label="Due date"
                    clearable
                    leftSection={<IconCalendarEvent size={16} />}
                    value={dueDate}
                    onChange={(value) => setDueDate(value ? new Date(value) : null)}
                  />
                </>
              )}
              <Select
                label="Status"
                data={STATUS_OPTIONS}
                allowDeselect={false}
                leftSection={<IconProgressCheck size={16} />}
                value={status}
                onChange={(value) => value && setStatus(value as TaskStatus)}
              />
            </Stack>
          ) : (
            <Stack gap="sm">
              <Group gap="sm">
                <Select
                  size="xs"
                  w={150}
                  data={STATUS_OPTIONS}
                  allowDeselect={false}
                  leftSection={<IconProgressCheck size={14} />}
                  value={task.status}
                  onChange={(value) => {
                    if (value && value !== task.status) {
                      moveTaskStatus({ id: task.id, status: value as TaskStatus });
                    }
                  }}
                />
                {task.dueDate && (
                  <Group gap={4} wrap="nowrap" c="dimmed">
                    <IconCalendarDue size={14} />
                    <Text size="sm">{dayjs(task.dueDate).format("MMM D, YYYY")}</Text>
                  </Group>
                )}
              </Group>
              {task.tagIds.length > 0 ? (
                <TaskTagChips tagIds={task.tagIds} />
              ) : (
                <Text size="sm" c="dimmed" fs="italic">
                  No tags
                </Text>
              )}
            </Stack>
          )}
        </DetailSection>

        <DetailSection icon={<IconAlignLeft size={16} />} title="Description">
          {editing ? (
            <DescriptionEditor content={description} onChange={setDescription} />
          ) : (
            <RichTextContent html={task.description ?? ""} />
          )}
        </DetailSection>
      </Stack>
    </Container>
  );
}
