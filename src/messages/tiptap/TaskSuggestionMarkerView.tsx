import { Badge, Group, Text, UnstyledButton } from "@mantine/core";
import { IconClipboardList, IconX } from "@tabler/icons-react";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

import type { TaskSuggestionDraft } from "@/messages/models/taskSuggestionDraft";
import type { TaskSuggestionMarkerOptions } from "@/messages/tiptap/TaskSuggestionMarker";
import classes from "@/messages/tiptap/TaggedThreadMarkerView.module.css";

export function TaskSuggestionMarkerView(props: ReactNodeViewProps) {
  const { node, getPos, deleteNode, extension } = props;
  const draft = node.attrs.draft as TaskSuggestionDraft | null;
  const opts = extension.options as TaskSuggestionMarkerOptions;

  const count = draft?.tasks.filter((t) => t.title.trim().length > 0).length ?? 0;

  const requestEdit = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (pos == null || !draft) return;
    opts.onRequestEdit(pos, draft);
  };

  return (
    <NodeViewWrapper
      className={classes.wrapper}
      contentEditable={false}
      data-drag-handle
    >
      <Group gap="xs" wrap="wrap" align="center">
        <UnstyledButton
          onClick={requestEdit}
          className={classes.label}
          aria-label="Edit task suggestion"
        >
          <IconClipboardList size={14} />
          <Text size="xs" fw={600}>
            {draft?.title?.trim() || "Task batch"}
          </Text>
        </UnstyledButton>
        <Badge size="sm" variant="light" color="grape">
          {count} {count === 1 ? "task" : "tasks"}
        </Badge>
        <UnstyledButton
          onClick={() => deleteNode()}
          aria-label="Remove task suggestion"
          className={classes.remove}
        >
          <IconX size={14} />
        </UnstyledButton>
      </Group>
    </NodeViewWrapper>
  );
}
