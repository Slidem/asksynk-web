import { IconHash } from "@tabler/icons-react";
import type { SlashCommandItem } from "@/messages/tiptap/SlashCommandItem";

export interface SlashCommandHandlers {
  onStartTaggedThread: (args: {
    pos: number;
    deleteRange: { from: number; to: number };
  }) => void;
}

export function buildSlashCommandItems(
  handlers: SlashCommandHandlers,
): SlashCommandItem[] {
  return [
    {
      id: "tagged-thread",
      title: "Start tagged thread",
      subtitle: "Attach tags to this message",
      icon: IconHash,
      keywords: ["tag", "tagged", "thread", "question"],
      run: ({ editor, range }) => {
        handlers.onStartTaggedThread({
          pos: range.from,
          deleteRange: { from: range.from, to: range.to },
        });
        editor.chain().focus().run();
      },
    },
  ];
}
