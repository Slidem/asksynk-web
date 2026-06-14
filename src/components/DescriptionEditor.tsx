import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import classes from "@/components/DescriptionEditor.module.css";

interface Props {
  content: string;
  onChange: (html: string) => void;
  // Fired on blur with the current HTML — handy for commit-on-blur saves.
  onBlur?: (html: string) => void;
}

// Shared rich-text editor for descriptions (tasks, batches, suggestions).
// Generalized from TagDescriptionEditor: decoupled from any form, driven by
// content/onChange so it works with Mantine forms or plain useState alike.
export function DescriptionEditor({ content, onChange, onBlur }: Props) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: false }), Link],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onBlur: ({ editor }) => onBlur?.(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === content) return;
    editor.commands.setContent(content);
  }, [editor, content]);

  return (
    <RichTextEditor editor={editor} classNames={{ content: classes.content }}>
      <RichTextEditor.Content />
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
    </RichTextEditor>
  );
}
