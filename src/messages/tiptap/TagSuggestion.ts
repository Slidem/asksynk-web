import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import type { TagDto } from "@/tags/models/tag";
import { TagSuggestionList } from "@/messages/tiptap/TagSuggestionList";
import { addTagToMarker } from "@/messages/tiptap/addTagToMarker";

const MAX_RESULTS = 8;
const pluginKey = new PluginKey("tagSuggestion");

export interface TagSuggestionOptions {
  getTags: () => TagDto[];
  getExcludedTagIds: () => string[];
  onOpenChange?: (open: boolean) => void;
}

const matchQuery = (tag: TagDto, query: string) => {
  if (!query) return true;
  return tag.name.toLowerCase().includes(query.toLowerCase());
};

export const TagSuggestion = Extension.create<TagSuggestionOptions>({
  name: "tagSuggestion",

  addOptions() {
    return {
      getTags: () => [],
      getExcludedTagIds: () => [],
    };
  },

  addProseMirrorPlugins() {
    const onOpenChange = this.options.onOpenChange;

    const items = ({ query }: { query: string }) => {
      const excluded = new Set(this.options.getExcludedTagIds());
      return this.options
        .getTags()
        .filter((t) => !excluded.has(t.id) && matchQuery(t, query))
        .slice(0, MAX_RESULTS);
    };

    const command: SuggestionOptions["command"] = ({ editor, range, props }) => {
      const tag = props as TagDto;
      editor.chain().focus().deleteRange(range).run();
      addTagToMarker(editor, tag.id);
    };

    const render: SuggestionOptions["render"] = () => {
      let component: ReactRenderer | null = null;
      let popup: TippyInstance | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(TagSuggestionList, {
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
          onOpenChange?.(true);
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
          onOpenChange?.(false);
        },
      };
    };

    return [
      Suggestion({
        editor: this.editor,
        pluginKey,
        char: "#",
        startOfLine: false,
        allowSpaces: false,
        items,
        command,
        render,
      }),
    ];
  },
});
