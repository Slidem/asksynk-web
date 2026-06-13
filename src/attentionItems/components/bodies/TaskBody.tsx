import {
  ActionIcon,
  Badge,
  Collapse,
  Group,
  Loader,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import type { TaskMetadata } from "@/attentionItems/models/attentionItem";
import { TASK_STATUS_LABELS } from "@/tasks/models/task";
import { useTaskBatch } from "@/tasks/hooks/queries/useTaskBatch";

interface Props {
  metadata: TaskMetadata;
}

export function TaskBody({ metadata }: Props) {
  const isBatch = Boolean(metadata.taskBatchId);
  const [expanded, setExpanded] = useState(false);
  // Lazy: batch contents are fetched only when expanded.
  const { data: batch, isLoading } = useTaskBatch(metadata.taskBatchId, {
    enabled: expanded,
  });

  return (
    <Stack gap="xs">
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <Group gap={4} wrap="nowrap" style={{ minWidth: 0 }}>
          {isBatch && (
            <ActionIcon
              variant="subtle"
              size="sm"
              aria-label={expanded ? "Collapse batch" : "Expand batch"}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              )}
            </ActionIcon>
          )}
          <Text size="sm" style={{ minWidth: 0 }} truncate>
            {metadata.title}
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
                search={
                  metadata.taskBatchId
                    ? { tab: "my-tasks", focusBatchId: metadata.taskBatchId }
                    : { tab: "my-tasks", focusTaskId: metadata.taskId }
                }
                {...props}
              />
            )}
          >
            <IconArrowUpRight size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {isBatch && (
        <Collapse in={expanded}>
          {isLoading ? (
            <Loader size="xs" />
          ) : (
            <Stack gap={6} pl="md">
              {batch?.tasks.map((task) => (
                <Group key={task.id} justify="space-between" wrap="nowrap">
                  <Text size="xs" truncate style={{ minWidth: 0 }}>
                    {task.title}
                  </Text>
                  <Badge size="xs" variant="light">
                    {TASK_STATUS_LABELS[task.status]}
                  </Badge>
                </Group>
              ))}
            </Stack>
          )}
        </Collapse>
      )}
    </Stack>
  );
}
