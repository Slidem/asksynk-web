import { Badge, Group, Modal, Stack, Text } from "@mantine/core";
import {
  IconAlignLeft,
  IconCalendarDue,
  IconListCheck,
} from "@tabler/icons-react";
import dayjs from "dayjs";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { RichTextContent } from "@/components/RichTextContent";
import { UserBadge } from "@/components/UserBadge";
import { getConnectionDisplayName } from "@/lib/connections";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";
import { CollapsibleSection } from "@/tasks/components/CollapsibleSection";
import { SuggestionStatusBadge } from "@/tasks/components/SuggestionStatusBadge";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";
import {
  useDetailSuggestion,
  useIsTaskSuggestionDetailDialogOpened,
  useTaskSuggestionDetailDialogHandlers,
} from "@/tasks/hooks/dialogs/taskSuggestionDetailDialogHooks";
import { TASK_STATUS_LABELS } from "@/tasks/models/task";

// Read-only full view of a suggestion: details + subtask list. Editing /
// accepting still happen from the row's action buttons.
export function TaskSuggestionDetailDialog() {
  const isOpened = useIsTaskSuggestionDetailDialogOpened();
  const { suggestion, role } = useDetailSuggestion();
  const { close } = useTaskSuggestionDetailDialogHandlers();
  const isMobile = useIsMobile();

  const counterpartyId =
    suggestion &&
    (role === "sent"
      ? suggestion.suggesteeUserId
      : suggestion.suggesterUserId);
  const { data: counterparty } = useNetworkConnectionsQuery((connections) =>
    connections.find((c) => c.userId === counterpartyId),
  );

  if (!suggestion) return null;

  const { payload, status, materializedTasks } = suggestion;
  const childCount = payload.kind === "batch" ? payload.tasks.length : 0;
  const counterpartyName = counterparty
    ? getConnectionDisplayName(counterparty)
    : "Someone";
  const summary =
    role === "sent"
      ? `You suggested ${childCount} ${childCount === 1 ? "task" : "tasks"} to ${counterpartyName}`
      : `${counterpartyName} suggested ${childCount} ${childCount === 1 ? "task" : "tasks"}`;

  return (
    <Modal
      opened={isOpened}
      onClose={close}
      title="Suggestion details"
      size="lg"
      fullScreen={isMobile}
    >
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <Text fw={600} truncate>
              {payload.title}
            </Text>
            {payload.kind === "batch" && (
              <Badge size="xs" variant="light" color="grape">
                Batch · {childCount}
              </Badge>
            )}
          </Group>
          <SuggestionStatusBadge status={status} />
        </Group>

        <Group gap="sm" wrap="nowrap">
          <UserBadge
            variant="avatar"
            name={counterparty ? counterpartyName : null}
            email={counterparty?.email}
            image={counterparty?.image}
          />
          <Text size="sm" c="dimmed">
            {summary}
          </Text>
        </Group>

        <Group gap="md" wrap="wrap">
          {payload.dueDate && (
            <Group gap={4} wrap="nowrap" c="dimmed">
              <IconCalendarDue size={14} />
              <Text size="sm">
                {dayjs(payload.dueDate).format("MMM D, YYYY")}
              </Text>
            </Group>
          )}
          <TaskTagChips
            tagIds={payload.tagIds}
            userId={role === "sent" ? suggestion.suggesteeUserId : undefined}
          />
        </Group>

        <CollapsibleSection
          icon={<IconAlignLeft size={14} />}
          title="Description"
        >
          <RichTextContent html={payload.description ?? ""} />
        </CollapsibleSection>

        {payload.kind === "batch" && (
          <CollapsibleSection
            icon={<IconListCheck size={14} />}
            title="Tasks"
            action={
              <Badge size="sm" variant="light" color="gray">
                {childCount}
              </Badge>
            }
          >
            <Stack gap="xs">
              {status === "accepted" && materializedTasks
                ? materializedTasks.map((task) => (
                    <Group key={task.id} justify="space-between" wrap="nowrap">
                      <Text size="sm" truncate style={{ minWidth: 0 }}>
                        {task.title}
                      </Text>
                      <Badge size="xs" variant="light">
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                    </Group>
                  ))
                : payload.tasks.map((task, index) => (
                    <Stack key={index} gap={2}>
                      <Text size="sm">{task.title}</Text>
                      {task.description && (
                        <Text size="xs" c="dimmed">
                          {task.description}
                        </Text>
                      )}
                    </Stack>
                  ))}
            </Stack>
          </CollapsibleSection>
        )}
      </Stack>
    </Modal>
  );
}
