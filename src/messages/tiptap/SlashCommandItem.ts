import type { Editor, Range } from "@tiptap/core";
import type { ComponentType } from "react";
import type { Icon } from "@tabler/icons-react";

export interface SlashCommandRunArgs {
  editor: Editor;
  range: Range;
}

export interface SlashCommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: Icon | ComponentType<{ size?: number }>;
  keywords?: string[];
  run: (args: SlashCommandRunArgs) => void;
}
