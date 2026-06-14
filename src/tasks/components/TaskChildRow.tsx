import { ActionIcon, Box, Collapse, Group, Input, TextInput } from "@mantine/core";
import {
  IconAlignLeft,
  IconChevronDown,
  IconChevronRight,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { DescriptionEditor } from "@/components/DescriptionEditor";
import { isBlankHtml } from "@/lib/isBlankHtml";
import type { TaskChildFormValues } from "@/tasks/models/taskForm";

interface Props {
  child: TaskChildFormValues;
  onChange: (patch: Partial<TaskChildFormValues>) => void;
  onRemove: () => void;
  canRemove: boolean;
  // Enter on a non-empty title appends a fresh row below and focuses it.
  autoFocus?: boolean;
  onEnter?: () => void;
  onFocused?: () => void;
}

// One batch/suggestion child: a single-line title row; the description editor is
// collapsed by default and revealed via the chevron (keeps the list compact).
export function TaskChildRow({
  child,
  onChange,
  onRemove,
  canRemove,
  autoFocus,
  onEnter,
  onFocused,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasDescription = !isBlankHtml(child.description);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      titleRef.current?.focus();
      onFocused?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  return (
    <Box>
      <Group gap="xs" align="center" wrap="nowrap">
        <ActionIcon
          variant="subtle"
          color={hasDescription && !expanded ? "blue" : "gray"}
          size="sm"
          aria-label={expanded ? "Hide description" : "Add description"}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <IconChevronDown size={14} />
          ) : (
            <IconChevronRight size={14} />
          )}
        </ActionIcon>
        <TextInput
          ref={titleRef}
          placeholder="Task title"
          value={child.title}
          onChange={(e) => onChange({ title: e.currentTarget.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && child.title.trim()) {
              e.preventDefault();
              onEnter?.();
            }
          }}
          style={{ flex: 1 }}
        />
        <ActionIcon
          variant="subtle"
          color="red"
          disabled={!canRemove}
          onClick={onRemove}
          aria-label="Remove task"
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      <Collapse in={expanded}>
        <Input.Wrapper
          mt="xs"
          ml={36}
          label={
            <Group gap={4} component="span">
              <IconAlignLeft size={14} />
              Description
            </Group>
          }
        >
          <DescriptionEditor
            content={child.description}
            onChange={(html) => onChange({ description: html })}
          />
        </Input.Wrapper>
      </Collapse>
    </Box>
  );
}
