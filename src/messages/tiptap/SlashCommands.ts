import { Extension } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import { SlashCommandsList } from "@/messages/tiptap/SlashCommandsList";
import type { SlashCommandItem } from "@/messages/tiptap/SlashCommandItem";

export interface SlashCommandsOptions {
  getItems: () => SlashCommandItem[];
}

const fuzzy = (item: SlashCommandItem, query: string) => {
  if (!query) return true;
  const q = query.toLowerCase();
  if (item.title.toLowerCase().includes(q)) return true;
  return (item.keywords ?? []).some((k) => k.toLowerCase().includes(q));
};

export const SlashCommands = Extension.create<SlashCommandsOptions>({
  name: "slashCommands",

  addOptions() {
    return { getItems: () => [] };
  },

  addProseMirrorPlugins() {
    const items = ({ query }: { query: string }) =>
      this.options.getItems().filter((i) => fuzzy(i, query));

    const command: SuggestionOptions["command"] = ({
      editor,
      range,
      props,
    }) => {
      const item = props as SlashCommandItem;
      item.run({ editor, range });
    };

    const render: SuggestionOptions["render"] = () => {
      let component: ReactRenderer | null = null;
      let popup: TippyInstance | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(SlashCommandsList, {
            props,
            editor: props.editor,
          });
          if (!props.clientRect) return;
          popup = tippy(document.body, {
            getReferenceClientRect: () => props.clientRect?.() ?? new DOMRect(),
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },
        onUpdate: (props) => {
          component?.updateProps(props);
          if (!props.clientRect || !popup) return;
          popup.setProps({
            getReferenceClientRect: () => props.clientRect?.() ?? new DOMRect(),
          });
        },
        onKeyDown: (props) => {
          if (props.event.key === "Escape") {
            popup?.hide();
            return true;
          }
          const ref = component?.ref as {
            onKeyDown?: (e: KeyboardEvent) => boolean;
          } | null;
          return ref?.onKeyDown?.(props.event) ?? false;
        },
        onExit: () => {
          popup?.destroy();
          component?.destroy();
          popup = null;
          component = null;
        },
      };
    };

    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        startOfLine: false,
        allowSpaces: false,
        items,
        command,
        render,
      }),
    ];
  },
});
