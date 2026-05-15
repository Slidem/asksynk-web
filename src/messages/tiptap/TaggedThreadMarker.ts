import { Node, mergeAttributes, type Editor, type JSONContent } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TaggedThreadMarkerView } from "@/messages/tiptap/TaggedThreadMarkerView";

export interface TaggedThreadMarkerOptions {
  onRequestEdit: (pos: number, tagIds: string[]) => void;
  /** Owner of the tags shown in the chip preview (recipient in DM context). */
  recipientUserId: string | null;
}

const ATTR = "data-tag-ids";
const NAME = "taggedThreadMarker";

export const TaggedThreadMarker = Node.create<TaggedThreadMarkerOptions>({
  name: NAME,
  group: "block",
  atom: true,
  selectable: false,
  draggable: false,

  addOptions() {
    return { onRequestEdit: () => {}, recipientUserId: null };
  },

  addAttributes() {
    return {
      tagIds: {
        default: [] as string[],
        parseHTML: (el) => {
          const raw = el.getAttribute(ATTR) ?? "";
          return raw ? raw.split(",").filter(Boolean) : [];
        },
        renderHTML: (attrs) => {
          const ids = (attrs.tagIds as string[]) ?? [];
          return { [ATTR]: ids.join(",") };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[${ATTR}]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-tagged-marker": "" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TaggedThreadMarkerView);
  },
});

export function insertTaggedMarker(editor: Editor, tagIds: string[]) {
  editor
    .chain()
    .focus()
    .insertContentAt(0, { type: NAME, attrs: { tagIds } })
    .run();
}

export function taggedMarkerInitialContent(tagIds: string[]): JSONContent {
  return {
    type: "doc",
    content: [
      { type: NAME, attrs: { tagIds } },
      { type: "paragraph" },
    ],
  };
}

export function updateTaggedMarker(
  editor: Editor,
  pos: number,
  tagIds: string[],
) {
  const { state, view } = editor;
  const node = state.doc.nodeAt(pos);
  if (!node || node.type.name !== NAME) return;
  view.dispatch(state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, tagIds }));
}

export function removeTaggedMarker(editor: Editor, pos: number) {
  const { state, view } = editor;
  const node = state.doc.nodeAt(pos);
  if (!node || node.type.name !== NAME) return;
  view.dispatch(state.tr.delete(pos, pos + node.nodeSize));
}
