import {
  ActionIcon,
  Badge,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendarDue,
  IconCheck,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";

import { UserBadge } from "@/components/UserBadge";
import { getConnectionDisplayName } from "@/lib/connections";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";
import { SuggestionStatusBadge } from "@/tasks/components/SuggestionStatusBadge";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";
import { useEditTaskSuggestionDialogHandlers } from "@/tasks/hooks/dialogs/editTaskSuggestionDialogHooks";
import { useRescindTaskSuggestion } from "@/tasks/hooks/mutations/useRescindTaskSuggestion";
import { useRespondToTaskSuggestion } from "@/tasks/hooks/mutations/useRespondToTaskSuggestion";
import type {
  SuggestionRole,
  TaskSuggestion,
} from "@/tasks/models/taskSuggestion";
import classes from "@/tasks/components/focusFlash.module.css";

interface Props {
  suggestion: TaskSuggestion;
  role: SuggestionRole;
  flashRef?: (el: HTMLElement | null) => void;
  highlighted?: boolean;
}

export function SuggestionRow({
  suggestion,
  role,
  flashRef,
  highlighted = false,
}: Props) {
  const { rescind, isRescinding } = useRescindTaskSuggestion();
  const { respond, isResponding } = useRespondToTaskSuggestion();
  const { open: openEdit } = useEditTaskSuggestionDialogHandlers();

  // Counterparty: who it's for when sent, who it's from when received.
  const counterpartyId =
    role === "sent" ? suggestion.suggesteeUserId : suggestion.suggesterUserId;
  const { data: counterparty } = useNetworkConnectionsQuery((connections) =>
    connections.find((c) => c.userId === counterpartyId),
  );

  const { payload } = suggestion;
  const childCount = payload.kind === "batch" ? payload.tasks.length : 0;
  const isPending = suggestion.status === "pending";

  return (
    <Group
      ref={flashRef}
      className={highlighted ? classes.highlight : undefined}
      justify="space-between"
      wrap="nowrap"
      px="md"
      py="sm"
    >
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        <UserBadge
          variant="avatar"
          name={counterparty ? getConnectionDisplayName(counterparty) : null}
          email={counterparty?.email}
          image={counterparty?.image}
        />
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Group gap="xs" wrap="nowrap">
            <Text size="sm" fw={500} truncate>
              {payload.title}
            </Text>
            {payload.kind === "batch" && (
              <Badge size="xs" variant="light" color="grape">
                Batch · {childCount}
              </Badge>
            )}
          </Group>
          <Group gap="xs" wrap="nowrap">
            <Text size="xs" c="dimmed">
              {role === "sent" ? "Sent" : "Received"}{" "}
              {dayjs(suggestion.createdAt).format("MMM D, YYYY")}
            </Text>
            {payload.dueDate && (
              <Group gap={2} wrap="nowrap" c="dimmed">
                <IconCalendarDue size={12} />
                <Text size="xs">
                  {dayjs(payload.dueDate).format("MMM D")}
                </Text>
              </Group>
            )}
            <TaskTagChips
              tagIds={payload.tagIds}
              userId={role === "sent" ? suggestion.suggesteeUserId : undefined}
            />
          </Group>
        </Stack>
      </Group>

      <Group gap="xs" wrap="nowrap">
        <SuggestionStatusBadge status={suggestion.status} />
        {isPending && role === "received" && (
          <>
            <Tooltip label="Accept" withArrow>
              <ActionIcon
                color="green"
                variant="subtle"
                loading={isResponding}
                onClick={() =>
                  respond({ id: suggestion.id, status: "accepted" })
                }
                aria-label="Accept suggestion"
              >
                <IconCheck size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Reject" withArrow>
              <ActionIcon
                variant="subtle"
                disabled={isResponding}
                onClick={() =>
                  respond({ id: suggestion.id, status: "rejected" })
                }
                aria-label="Reject suggestion"
              >
                <IconX size={16} />
              </ActionIcon>
            </Tooltip>
          </>
        )}
        {isPending && (
          <Tooltip label="Edit" withArrow>
            <ActionIcon
              variant="subtle"
              onClick={() => openEdit(suggestion)}
              aria-label="Edit suggestion"
            >
              <IconPencil size={16} />
            </ActionIcon>
          </Tooltip>
        )}
        {isPending && role === "sent" && (
          <Tooltip label="Rescind" withArrow>
            <ActionIcon
              variant="subtle"
              color="red"
              loading={isRescinding}
              onClick={() => rescind(suggestion.id)}
              aria-label="Rescind suggestion"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Group>
  );
}
