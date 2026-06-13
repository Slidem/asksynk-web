import {
  ActionIcon,
  Badge,
  Button,
  Collapse,
  Group,
  Loader,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconCalendarDue,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";

import type { SuggestedTaskMetadata } from "@/attentionItems/models/attentionItem";
import { UserBadge } from "@/components/UserBadge";
import { getConnectionDisplayName } from "@/lib/connections";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";
import { TaskTagChips } from "@/tasks/components/TaskTagChips";
import { useRespondToTaskSuggestion } from "@/tasks/hooks/mutations/useRespondToTaskSuggestion";
import { useTaskSuggestion } from "@/tasks/hooks/queries/useTaskSuggestion";

interface Props {
  metadata: SuggestedTaskMetadata;
}

export function SuggestedTaskBody({ metadata }: Props) {
  const { respond, isResponding } = useRespondToTaskSuggestion();
  const { data: suggester } = useNetworkConnectionsQuery((connections) =>
    connections.find((c) => c.userId === metadata.suggesterUserId),
  );

  const [expanded, setExpanded] = useState(false);
  // Lazy: the payload (batch children, due date, tags) loads on expand.
  const { data: suggestion, isLoading } = useTaskSuggestion(
    metadata.suggestionId,
    { enabled: expanded },
  );
  const payload = suggestion?.payload;

  return (
    <Stack gap="xs">
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
          <ActionIcon
            variant="subtle"
            size="sm"
            aria-label={expanded ? "Collapse details" : "Expand details"}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <IconChevronDown size={14} />
            ) : (
              <IconChevronRight size={14} />
            )}
          </ActionIcon>
          <UserBadge
            variant="avatar"
            size={20}
            name={suggester ? getConnectionDisplayName(suggester) : null}
            email={suggester?.email}
            image={suggester?.image}
          />
          <Text size="sm" truncate>
            <Text span fw={500}>
              {suggester ? getConnectionDisplayName(suggester) : "Someone"}
            </Text>{" "}
            suggested: {metadata.title}
          </Text>
        </Group>
        <Tooltip label="Open in tasks" withArrow>
          <ActionIcon
            variant="subtle"
            size="sm"
            aria-label="Open in tasks"
            renderRoot={(props) => (
              <Link
                to="/tasks"
                search={{
                  tab: "suggested-to-me",
                  focusSuggestionId: metadata.suggestionId,
                }}
                {...props}
              />
            )}
          >
            <IconArrowUpRight size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Collapse in={expanded}>
        {isLoading ? (
          <Loader size="xs" />
        ) : (
          payload && (
            <Stack gap={6} pl="md">
              <Group gap="xs" wrap="nowrap">
                {payload.dueDate && (
                  <Group gap={2} wrap="nowrap" c="dimmed">
                    <IconCalendarDue size={12} />
                    <Text size="xs">
                      {dayjs(payload.dueDate).format("MMM D")}
                    </Text>
                  </Group>
                )}
                {/* Suggestee is the current user, so these are own tags. */}
                <TaskTagChips tagIds={payload.tagIds} />
              </Group>
              {payload.kind === "batch" &&
                payload.tasks.map((task, index) => (
                  <Group key={index} gap="xs" wrap="nowrap">
                    <Badge size="xs" variant="light" color="grape">
                      {index + 1}
                    </Badge>
                    <Text size="xs" truncate style={{ minWidth: 0 }}>
                      {task.title}
                    </Text>
                  </Group>
                ))}
            </Stack>
          )
        )}
      </Collapse>

      <Group gap="xs">
        <Button
          size="xs"
          leftSection={<IconCheck size={14} />}
          loading={isResponding}
          onClick={() =>
            respond({ id: metadata.suggestionId, status: "accepted" })
          }
        >
          Accept
        </Button>
        <Button
          size="xs"
          variant="default"
          leftSection={<IconX size={14} />}
          disabled={isResponding}
          onClick={() =>
            respond({ id: metadata.suggestionId, status: "rejected" })
          }
        >
          Reject
        </Button>
      </Group>
    </Stack>
  );
}
