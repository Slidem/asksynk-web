import { ActionIcon, Box, Collapse, Group, Input, TextInput } from "@mantine/core";
import {
  IconAlignLeft,
  IconChevronDown,
  IconChevronRight,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

import { DescriptionEditor } from "@/components/DescriptionEditor";
import { isBlankHtml } from "@/lib/isBlankHtml";
import { useDeleteTask } from "@/tasks/hooks/mutations/useDeleteTask";
import { useUpdateTask } from "@/tasks/hooks/mutations/useUpdateTask";
import type { TaskDto } from "@/tasks/models/task";

interface Props {
  task: TaskDto;
}

// Editable existing batch child (batch page edit mode). Title + description
// commit on blur via useUpdateTask; delete via useDeleteTask. Live/optimistic.
export function BatchTaskEditRow({ task }: Props) {
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();
  const [expanded, setExpanded] = useState(!isBlankHtml(task.description));
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");

  const commitTitle = () => {
    const next = title.trim();
    if (!next || next === task.title) {
      setTitle(task.title);
      return;
    }
    updateTask({ id: task.id, title: next });
  };

  const commitDescription = (html: string) => {
    const next = isBlankHtml(html) ? null : html;
    if (next === (task.description ?? null)) return;
    updateTask({ id: task.id, description: next });
  };

  return (
    <Box>
      <Group gap="xs" align="center" wrap="nowrap">
        <ActionIcon
          variant="subtle"
          color={!isBlankHtml(description) && !expanded ? "blue" : "gray"}
          size="sm"
          aria-label={expanded ? "Hide description" : "Edit description"}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <IconChevronDown size={14} />
          ) : (
            <IconChevronRight size={14} />
          )}
        </ActionIcon>
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          onBlur={commitTitle}
          style={{ flex: 1 }}
        />
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => deleteTask(task.id)}
          aria-label="Delete task"
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
            content={description}
            onChange={setDescription}
            onBlur={commitDescription}
          />
        </Input.Wrapper>
      </Collapse>
    </Box>
  );
}
