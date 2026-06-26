import { Node, mergeAttributes, type Editor } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { TaskSuggestionDraft } from "@/messages/models/taskSuggestionDraft";
import { TaskSuggestionMarkerView } from "@/messages/tiptap/TaskSuggestionMarkerView";

export interface TaskSuggestionMarkerOptions {
  onRequestEdit: (pos: number, draft: TaskSuggestionDraft) => void;
}

const NAME = "taskSuggestionMarker";

// Holds the batch draft in node attrs (read directly on send — never round-trips
// through HTML, so the body strips it out cleanly, like TaggedThreadMarker).
export const TaskSuggestionMarker = Node.create<TaskSuggestionMarkerOptions>({
  name: NAME,
  group: "block",
  atom: true,
  selectable: false,
  draggable: false,

  addOptions() {
    return { onRequestEdit: () => {} };
  },

  addAttributes() {
    return {
      draft: {
        default: null as TaskSuggestionDraft | null,
        // Drafts never persist to/from HTML; the live node is the only source.
        parseHTML: () => null,
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-task-suggestion-marker]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-task-suggestion-marker": "" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TaskSuggestionMarkerView);
  },
});

export function insertTaskSuggestionMarker(
  editor: Editor,
  draft: TaskSuggestionDraft,
) {
  editor
    .chain()
    .focus()
    .insertContentAt(0, { type: NAME, attrs: { draft } })
    .run();
}

export function updateTaskSuggestionMarker(
  editor: Editor,
  pos: number,
  draft: TaskSuggestionDraft,
) {
  const { state, view } = editor;
  const node = state.doc.nodeAt(pos);
  if (!node || node.type.name !== NAME) return;
  view.dispatch(
    state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, draft }),
  );
}

export function removeTaskSuggestionMarker(editor: Editor, pos: number) {
  const { state, view } = editor;
  const node = state.doc.nodeAt(pos);
  if (!node || node.type.name !== NAME) return;
  view.dispatch(state.tr.delete(pos, pos + node.nodeSize));
}

export function findTaskSuggestionMarker(
  editor: Editor,
): { pos: number; draft: TaskSuggestionDraft } | null {
  let found: { pos: number; draft: TaskSuggestionDraft } | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === NAME) {
      found = { pos, draft: node.attrs.draft as TaskSuggestionDraft };
      return false;
    }
    return true;
  });
  return found;
}
