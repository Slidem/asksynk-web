import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useSendMessage } from "@/messages/hooks/useSendMessage";
import {
  TaggedThreadMarker,
  insertTaggedMarker,
  removeTaggedMarker,
  updateTaggedMarker,
} from "@/messages/tiptap/TaggedThreadMarker";
import { SlashCommands } from "@/messages/tiptap/SlashCommands";
import { buildSlashCommandItems } from "@/messages/tiptap/slashCommandItems";
import { extractTaggedMessage } from "@/messages/tiptap/extractTaggedMessage";
import { TagPickerDialog } from "@/messages/components/TagPickerDialog";

interface Props {
  threadId: string;
  frozen?: boolean;
  /** null for guest threads; disables tag actions. */
  recipientUserId: string | null;
}

interface PickerState {
  open: boolean;
  initialTagIds: string[];
  /** marker node position when editing existing marker; null when creating */
  editPos: number | null;
  /** range to delete (the typed "/...") when creating from slash */
  deleteRange: { from: number; to: number } | null;
}

const CLOSED: PickerState = {
  open: false,
  initialTagIds: [],
  editPos: null,
  deleteRange: null,
};

export function MessageComposer({
  threadId,
  frozen = false,
  recipientUserId,
}: Props) {
  const { sendMessage, isSending } = useSendMessage(threadId);
  const [picker, setPicker] = useState<PickerState>(CLOSED);
  const canTag = recipientUserId != null;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      ...(canTag
        ? [
            TaggedThreadMarker.configure({
              recipientUserId,
              onRequestEdit: (pos: number, tagIds: string[]) =>
                setPicker({
                  open: true,
                  initialTagIds: tagIds,
                  editPos: pos,
                  deleteRange: null,
                }),
            }),
            SlashCommands.configure({
              getItems: () =>
                buildSlashCommandItems({
                  onStartTaggedThread: ({ deleteRange }) =>
                    setPicker({
                      open: true,
                      initialTagIds: [],
                      editPos: null,
                      deleteRange,
                    }),
                }),
            }),
          ]
        : []),
    ],
    content: "",
    editorProps: {
      attributes: { "aria-label": "Message body" },
      handleKeyDown: (_view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleSend();
          return true;
        }
        return false;
      },
    },
  });

  const handleSend = useCallback(() => {
    if (!editor || frozen) return;
    const { body, tagIds, isEmptyBody } = extractTaggedMessage(editor);
    if (isEmptyBody && tagIds.length === 0) return;
    sendMessage(body, tagIds);
    editor.commands.clearContent();
  }, [editor, frozen, sendMessage]);

  const handleConfirm = useCallback(
    (tagIds: string[]) => {
      if (!editor) return;

      if (picker.editPos != null) {
        if (tagIds.length === 0) {
          removeTaggedMarker(editor, picker.editPos);
        } else {
          updateTaggedMarker(editor, picker.editPos, tagIds);
        }
        return;
      }

      if (tagIds.length === 0) return;

      const { from, to } = picker.deleteRange ?? { from: 0, to: 0 };
      if (to > from) {
        editor.chain().focus().deleteRange({ from, to }).run();
      }
      insertTaggedMarker(editor, tagIds);
    },
    [editor, picker.deleteRange, picker.editPos],
  );

  if (frozen) {
    return (
      <Stack
        align="center"
        py="md"
        style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
      >
        <Text size="sm" c="dimmed">
          This conversation is frozen.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xs" p="sm">
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.CodeBlock />
            <RichTextEditor.Link />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
      <Group justify="space-between" align="center">
        <Text size="xs" c="dimmed">
          Enter to send · Shift+Enter for newline
          {canTag ? " · / for commands" : ""}
        </Text>
        <ActionIcon
          aria-label="Send message"
          variant="filled"
          size="lg"
          onClick={handleSend}
          loading={isSending}
        >
          <IconSend size={18} />
        </ActionIcon>
      </Group>
      {canTag && (
        <TagPickerDialog
          opened={picker.open}
          initialTagIds={picker.initialTagIds}
          targetUserId={recipientUserId}
          title={picker.editPos != null ? "Edit tags" : "Tag this thread"}
          confirmLabel={picker.editPos != null ? "Save" : "Tag thread"}
          onConfirm={handleConfirm}
          onClose={() => setPicker(CLOSED)}
        />
      )}
    </Stack>
  );
}
