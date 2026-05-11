import { IconClock, IconHash } from "@tabler/icons-react";
import type { SlashCommandItem } from "@/messages/tiptap/SlashCommandItem";

export interface SlashCommandHandlers {
  onStartTaggedThread: () => void;
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
        editor.chain().deleteRange(range).blur().run();
        handlers.onStartTaggedThread();
      },
    },
    {
      id: "suggest-timeblock",
      title: "Suggest timeblock",
      subtitle: "Propose a timeblock (coming soon)",
      icon: IconClock,
      keywords: ["timeblock", "suggest", "schedule"],
      run: () => {},
    },
  ];
}
