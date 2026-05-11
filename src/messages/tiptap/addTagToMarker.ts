import type { Editor } from "@tiptap/core";
import {
  insertTaggedMarker,
  updateTaggedMarker,
} from "@/messages/tiptap/TaggedThreadMarker";

const NAME = "taggedThreadMarker";

interface MarkerHit {
  pos: number;
  tagIds: string[];
}

export function findTaggedMarker(editor: Editor): MarkerHit | null {
  let hit: MarkerHit | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (hit) return false;
    if (node.type.name === NAME) {
      hit = { pos, tagIds: (node.attrs.tagIds as string[]) ?? [] };
      return false;
    }
    return true;
  });
  return hit;
}

export function addTagToMarker(editor: Editor, tagId: string) {
  const hit = findTaggedMarker(editor);
  if (!hit) {
    insertTaggedMarker(editor, [tagId]);
    return;
  }
  if (hit.tagIds.includes(tagId)) return;
  updateTaggedMarker(editor, hit.pos, [...hit.tagIds, tagId]);
}
