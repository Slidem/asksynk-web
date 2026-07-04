import { ActionIcon, Group, Pill, Stack, Text } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { IconHash, IconSend } from "@tabler/icons-react";
import type { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";

import { SlashCommands } from "@/messages/tiptap/SlashCommands";
import type { SlashCommandItem } from "@/messages/tiptap/SlashCommandItem";
import { PublicTagPickerDialog } from "@/public-schedule/components/PublicTagPickerDialog";
import { usePublicTagsQuery } from "@/public-schedule/hooks/queries/usePublicTagsQuery";
import { useSendGuestMessage } from "@/public-schedule/hooks/mutations/useSendGuestMessage";

interface Props {
  slug: string;
}

// Guest "/" quick actions. Only tagging applies to guests (the owner replies
// untagged); tasks/timeblocks are owner features.
function buildGuestSlashItems(onTagMessage: () => void): SlashCommandItem[] {
  return [
    {
      id: "tag-message",
      title: "Tag message",
      subtitle: "Tag so the owner knows how to route it",
      icon: IconHash,
      keywords: ["tag", "tagged", "question", "route"],
      run: ({ editor, range }) => {
        editor.chain().deleteRange(range).blur().run();
        onTagMessage();
      },
    },
  ];
}

export function PublicMessageComposer({ slug }: Props) {
  const { sendMessage, isSending } = useSendGuestMessage(slug);
  const { data: tags } = usePublicTagsQuery(slug);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const editorRef = useRef<Editor | null>(null);
  const tagIdsRef = useRef<string[]>([]);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    tagIdsRef.current = tagIds;
  }, [tagIds]);

  const doSend = useCallback(() => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const ids = tagIdsRef.current;

    if (editor.getText().trim().length === 0 && ids.length === 0) {
      return;
    }

    sendMessage(editor.getHTML(), ids);
    editor.commands.clearContent();
    setTagIds([]);
  }, [sendMessage]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      // eslint-disable-next-line react-hooks/refs
      SlashCommands.configure({
        getItems: () => buildGuestSlashItems(() => setPickerOpen(true)),
        onOpenChange: (open) => {
          menuOpenRef.current = open;
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: { "aria-label": "Message body" },
      handleKeyDown: (_view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          if (menuOpenRef.current) return false;
          event.preventDefault();
          doSend();
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const removeTag = (id: string) =>
    setTagIds((ids) => ids.filter((t) => t !== id));

  return (
    <Stack
      gap="xs"
      p="sm"
      style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
    >
      {tagIds.length > 0 && (
        <Group gap={4} wrap="wrap">
          {tagIds.map((id) => {
            const tag = tags?.find((t) => t.id === id);
            return (
              <Pill
                key={id}
                withRemoveButton
                onRemove={() => removeTag(id)}
                styles={
                  tag
                    ? { root: { backgroundColor: tag.color, color: "#fff" } }
                    : undefined
                }
              >
                {tag?.name ?? "Tag"}
              </Pill>
            );
          })}
        </Group>
      )}
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
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
          Enter to send · Shift+Enter for newline · / for quick actions
        </Text>
        <ActionIcon
          aria-label="Send message"
          variant="filled"
          size="lg"
          onClick={doSend}
          loading={isSending}
        >
          <IconSend size={18} />
        </ActionIcon>
      </Group>
      <PublicTagPickerDialog
        opened={pickerOpen}
        slug={slug}
        initialTagIds={tagIds}
        onConfirm={setTagIds}
        onClose={() => setPickerOpen(false)}
      />
    </Stack>
  );
}
