import { ActionIcon, Box, Collapse, Group, Select, Text } from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";

import { RichTextContent } from "@/components/RichTextContent";
import { isBlankHtml } from "@/lib/isBlankHtml";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  type TaskDto,
  type TaskStatus,
} from "@/tasks/models/task";

export const STATUS_OPTIONS = TASK_STATUS_ORDER.map((status) => ({
  value: status,
  label: TASK_STATUS_LABELS[status],
}));

interface Props {
  task: TaskDto;
  onStatusChange: (status: TaskStatus) => void;
}

// Read-only, collapsible child row: one line (title + status); the description
// expands via the chevron. Shared by the batch dialog and the batch page view.
export function BatchTaskRow({ task, onStatusChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasDescription = !isBlankHtml(task.description);

  return (
    <Box>
      <Group justify="space-between" wrap="nowrap" gap="sm">
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          {hasDescription ? (
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label={expanded ? "Hide description" : "Show description"}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              )}
            </ActionIcon>
          ) : (
            <Box w={28} />
          )}
          <Text size="sm" truncate style={{ minWidth: 0 }}>
            {task.title}
          </Text>
        </Group>
        <Select
          size="xs"
          w={140}
          data={STATUS_OPTIONS}
          allowDeselect={false}
          value={task.status}
          onChange={(value) => {
            if (value && value !== task.status) onStatusChange(value as TaskStatus);
          }}
        />
      </Group>
      {hasDescription && (
        <Collapse in={expanded}>
          <Box pl={36} pt="xs">
            <RichTextContent html={task.description ?? ""} />
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
