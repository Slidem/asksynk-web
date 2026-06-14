import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Input,
  Loader,
  Progress,
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
  IconListCheck,
  IconListDetails,
  IconPencil,
  IconPlus,
  IconTag,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { Fragment, useCallback, useState } from "react";

import { DescriptionEditor } from "@/components/DescriptionEditor";
import { RichTextContent } from "@/components/RichTextContent";
import { toISOStringWithTimezone } from "@/lib/date";
import { isBlankHtml } from "@/lib/isBlankHtml";
import { UserTagPicker } from "@/tags/components/UserTagPicker";
import { BatchDeleteButton } from "@/tasks/components/BatchDeleteButton";
import { BatchTaskEditRow } from "@/tasks/components/BatchTaskEditRow";
import { BatchTaskRow } from "@/tasks/components/BatchTaskRow";
import { DetailSection } from "@/tasks/components/DetailSection";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";
import { useCreateTask } from "@/tasks/hooks/mutations/useCreateTask";
import { useMoveTaskStatus } from "@/tasks/hooks/mutations/useMoveTaskStatus";
import { useUpdateTaskBatch } from "@/tasks/hooks/mutations/useUpdateTaskBatch";
import { useTaskBatch } from "@/tasks/hooks/queries/useTaskBatch";
import { useTasks } from "@/tasks/hooks/queries/useTasks";
import type { TaskDto } from "@/tasks/models/task";

interface Props {
  batchId: string;
}

export function BatchDetailPage({ batchId }: Props) {
  const { data: batch, isLoading } = useTaskBatch(batchId);
  const selectChildren = useCallback(
    (tasks: TaskDto[]) => tasks.filter((task) => task.batchId === batchId),
    [batchId],
  );
  const { data: children = [] } = useTasks(selectChildren);

  const { updateTaskBatch, isUpdating } = useUpdateTaskBatch();
  const { moveTaskStatus } = useMoveTaskStatus();
  const { createTask, isCreating } = useCreateTask();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState("");

  if (isLoading) {
    return (
      <Container size="md" maw={820} w="100%" py="lg">
        <Loader />
      </Container>
    );
  }

  if (!batch) {
    return (
      <Container size="md" maw={820} w="100%" py="lg">
        <Stack gap="sm">
          <Text c="dimmed">Batch not found.</Text>
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

  const completed = children.filter((t) => t.status === "completed").length;

  const startEditing = () => {
    setTitle(batch.title);
    setDescription(batch.description ?? "");
    setDueDate(batch.dueDate ? new Date(batch.dueDate) : null);
    setTagIds(batch.tagIds);
    setEditing(true);
  };

  const saveBatch = () => {
    if (!title.trim()) return;
    updateTaskBatch({
      id: batchId,
      title: title.trim(),
      description: isBlankHtml(description) ? null : description,
      dueDate: dueDate ? toISOStringWithTimezone(new Date(dueDate)) : null,
      tagIds,
    });
    setEditing(false);
  };

  const addTask = () => {
    const t = newTitle.trim();
    if (!t) return;
    createTask({ title: t, batchId });
    setNewTitle("");
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
                    search={{ tab: "my-tasks", focusBatchId: batchId }}
                    {...props}
                  />
                )}
              >
                <IconArrowLeft size={18} />
              </ActionIcon>
            </Tooltip>
            <Title order={3} lineClamp={2} style={{ minWidth: 0 }}>
              {batch.title}
            </Title>
          </Group>
          {editing ? (
            <Group gap="xs" wrap="nowrap">
              <Button variant="default" onClick={() => setEditing(false)}>
                Done
              </Button>
              <Button loading={isUpdating} disabled={!title.trim()} onClick={saveBatch}>
                Save
              </Button>
            </Group>
          ) : (
            <Group gap="xs" wrap="nowrap">
              <BatchDeleteButton
                batchId={batchId}
                taskCount={children.length}
                onDeleted={() =>
                  navigate({ to: "/tasks", search: { tab: "my-tasks" } })
                }
              />
              <Button
                variant="default"
                leftSection={<IconPencil size={16} />}
                onClick={startEditing}
              >
                Edit
              </Button>
            </Group>
          )}
        </Group>

        <DetailSection icon={<IconListDetails size={16} />} title="Overview">
          {editing ? (
            <Stack gap="sm">
              <TextInput
                label="Batch title"
                withAsterisk
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
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
                    Tags (applied to the whole batch)
                  </Group>
                }
              >
                <UserTagPicker selectedTagIds={tagIds} onChange={setTagIds} />
              </Input.Wrapper>
            </Stack>
          ) : (
            <Stack gap="sm">
              <Group justify="space-between" align="center" gap="xs">
                <Text size="sm" c="dimmed">
                  {completed}/{children.length} done
                </Text>
                {batch.dueDate && (
                  <Group gap={4} wrap="nowrap" c="dimmed">
                    <IconCalendarDue size={14} />
                    <Text size="sm">
                      {dayjs(batch.dueDate).format("MMM D, YYYY")}
                    </Text>
                  </Group>
                )}
              </Group>
              <Progress
                value={children.length ? (completed / children.length) * 100 : 0}
                size="sm"
                color="grape"
              />
              {batch.tagIds.length > 0 && <TaskTagChips tagIds={batch.tagIds} />}
            </Stack>
          )}
        </DetailSection>

        <DetailSection icon={<IconAlignLeft size={16} />} title="Description">
          {editing ? (
            <DescriptionEditor content={description} onChange={setDescription} />
          ) : (
            <RichTextContent html={batch.description ?? ""} />
          )}
        </DetailSection>

        <DetailSection
          icon={<IconListCheck size={16} />}
          title="Tasks"
          action={
            <Badge size="sm" variant="light" color="gray">
              {children.length}
            </Badge>
          }
        >
          <Stack gap="xs">
            {children.length === 0 && (
              <Text size="sm" c="dimmed" fs="italic">
                No tasks yet
              </Text>
            )}
            {children.map((task, i) => (
              <Fragment key={task.id}>
                {i > 0 && <Divider />}
                {editing ? (
                  <BatchTaskEditRow task={task} />
                ) : (
                  <BatchTaskRow
                    task={task}
                    onStatusChange={(status) =>
                      moveTaskStatus({ id: task.id, status })
                    }
                  />
                )}
              </Fragment>
            ))}

            {editing && (
              <Group gap="xs" mt="xs" wrap="nowrap">
                <TextInput
                  placeholder="New task title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask();
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  size="sm"
                  leftSection={<IconPlus size={14} />}
                  loading={isCreating}
                  disabled={!newTitle.trim()}
                  onClick={addTask}
                >
                  Add
                </Button>
              </Group>
            )}
          </Stack>
        </DetailSection>
      </Stack>
    </Container>
  );
}
