import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import classes from "@/tags/components/TagDescriptionEditor.module.css";
import type { TagFormValues } from "@/tags/models/tagForm";
import type { UseFormReturnType } from "@mantine/form";

interface Props {
  form: UseFormReturnType<TagFormValues>;
  initialContent?: string;
}

export function TagDescriptionEditor({ form, initialContent = "" }: Props) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: false }), Link],
    content: initialContent,
    onUpdate: ({ editor }) =>
      form.setFieldValue("description", editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === initialContent) return;
    editor.commands.setContent(initialContent);
  }, [editor, initialContent]);

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
