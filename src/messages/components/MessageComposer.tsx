import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useSendMessage } from "@/messages/hooks/useSendMessage";

interface Props {
  threadId: string;
  frozen?: boolean;
}

export function MessageComposer({ threadId, frozen = false }: Props) {
  const { sendMessage, isSending } = useSendMessage(threadId);

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: false }), Link],
    content: "",
    editorProps: {
      attributes: {
        "aria-label": "Message body",
      },
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

  const handleSend = () => {
    if (!editor || frozen) {
      return;
    }
    const html = editor.getHTML();
    const isEmpty = editor.getText().trim().length === 0;
    if (isEmpty) {
      return;
    }
    sendMessage(html);
    editor.commands.clearContent();
  };

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
    </Stack>
  );
}
