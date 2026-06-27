import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Collapse,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarDue,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconClipboardList,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";

import { useSession } from "@/auth";
import { SuggestionStatusBadge } from "@/tasks/components/SuggestionStatusBadge";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";
import { useUpdateSuggestedTaskStatus } from "@/tasks/hooks/mutations/useUpdateSuggestedTaskStatus";
import { useRespondToTaskSuggestion } from "@/tasks/hooks/mutations/useRespondToTaskSuggestion";
import { useTaskSuggestion } from "@/tasks/hooks/queries/useTaskSuggestion";

interface Props {
  suggestionId: string;
}

// Inline card for a task batch suggested within a thread. Suggestee can
// accept/reject and check tasks off; suggester sees live read-only progress.
// Subtasks live behind a collapsible dropdown (like the attention items view).
export function MessageTaskSuggestionCard({ suggestionId }: Props) {
  const { data: session } = useSession();
  const { data: suggestion, isLoading } = useTaskSuggestion(suggestionId);
  const { respond, isResponding } = useRespondToTaskSuggestion();
  const { updateTaskStatus } = useUpdateSuggestedTaskStatus(suggestionId);
  const [expanded, { toggle }] = useDisclosure(false);

  if (isLoading || !suggestion) {
    return (
      <Paper withBorder p="xs" mt={6} radius="md">
        <Loader size="xs" />
      </Paper>
    );
  }

  const me = session?.user?.id;
  const isSuggestee = me === suggestion.suggesteeUserId;
  const { payload, status, materializedTasks } = suggestion;
  const childCount = payload.tasks.length;
  const hasSubtasks = childCount > 0;
  const doneCount =
    materializedTasks?.filter((t) => t.status === "completed").length ?? 0;
  const totalCount = materializedTasks?.length ?? childCount;

  return (
    <Paper withBorder p="sm" mt={6} radius="md">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            {hasSubtasks && (
              <ActionIcon
                variant="subtle"
                size="sm"
                aria-label={expanded ? "Hide tasks" : "Show tasks"}
                onClick={toggle}
              >
                {expanded ? (
                  <IconChevronDown size={14} />
                ) : (
                  <IconChevronRight size={14} />
                )}
              </ActionIcon>
            )}
            <IconClipboardList size={16} />
            <Text size="sm" fw={600} truncate>
              {payload.title}
            </Text>
            <Badge size="xs" variant="light" color="grape">
              Batch · {childCount}
            </Badge>
          </Group>
          <SuggestionStatusBadge status={status} />
        </Group>

        <Group gap="xs" wrap="wrap">
          {payload.dueDate && (
            <Group gap={2} wrap="nowrap" c="dimmed">
              <IconCalendarDue size={12} />
              <Text size="xs">{dayjs(payload.dueDate).format("MMM D")}</Text>
            </Group>
          )}
          <TaskTagChips
            tagIds={payload.tagIds}
            userId={isSuggestee ? undefined : suggestion.suggesteeUserId}
          />
          <Text size="xs" c="dimmed">
            {isSuggestee ? "Suggested to you" : "You suggested"}
          </Text>
        </Group>

        {status === "accepted" && (
          <Text size="xs" c="dimmed">
            {doneCount}/{totalCount} done
          </Text>
        )}

        {hasSubtasks && (
          <Collapse in={expanded}>
            <Stack gap={4} pl="md">
              {status === "accepted" && materializedTasks
                ? materializedTasks.map((task) => (
                    <Group key={task.id} gap="xs" wrap="nowrap">
                      <Checkbox
                        size="xs"
                        checked={task.status === "completed"}
                        disabled={!isSuggestee}
                        onChange={(e) =>
                          updateTaskStatus({
                            taskId: task.id,
                            status: e.currentTarget.checked
                              ? "completed"
                              : "todo",
                          })
                        }
                        label={
                          <Text
                            size="xs"
                            td={
                              task.status === "completed"
                                ? "line-through"
                                : undefined
                            }
                            c={
                              task.status === "completed" ? "dimmed" : undefined
                            }
                          >
                            {task.title}
                          </Text>
                        }
                      />
                      {task.status === "in_progress" && (
                        <Badge size="xs" variant="light" color="blue">
                          In progress
                        </Badge>
                      )}
                    </Group>
                  ))
                : payload.tasks.map((task, index) => (
                    <Text key={index} size="xs" c="dimmed">
                      • {task.title}
                    </Text>
                  ))}
            </Stack>
          </Collapse>
        )}

        {status === "pending" && isSuggestee && (
          <Group gap="xs">
            <Button
              size="xs"
              leftSection={<IconCheck size={14} />}
              loading={isResponding}
              onClick={() => respond({ id: suggestionId, status: "accepted" })}
            >
              Accept
            </Button>
            <Button
              size="xs"
              variant="default"
              leftSection={<IconX size={14} />}
              disabled={isResponding}
              onClick={() => respond({ id: suggestionId, status: "rejected" })}
            >
              Reject
            </Button>
          </Group>
        )}

        {status === "pending" && !isSuggestee && (
          <Text size="xs" c="dimmed">
            Waiting for a response
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
