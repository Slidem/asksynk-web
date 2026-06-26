import { IconClipboardList, IconClock, IconHash } from "@tabler/icons-react";
import type { SlashCommandItem } from "@/messages/tiptap/SlashCommandItem";

export interface SlashCommandHandlers {
  onStartTaggedThread: () => void;
  onSuggestTasks: () => void;
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
      id: "suggest-tasks",
      title: "Suggest tasks",
      subtitle: "Send a batch of tasks",
      icon: IconClipboardList,
      keywords: ["task", "tasks", "batch", "suggest", "todo"],
      run: ({ editor, range }) => {
        editor.chain().deleteRange(range).blur().run();
        handlers.onSuggestTasks();
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
