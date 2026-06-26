import type { Editor } from "@tiptap/core";

const MARKER = "taggedThreadMarker";

export interface ExtractedMessage {
  body: string;
  tagIds: string[];
  isEmptyBody: boolean;
}

export function extractTaggedMessage(editor: Editor): ExtractedMessage {
  let tagIds: string[] = [];

  editor.state.doc.descendants((node) => {
    if (node.type.name === MARKER) {
      tagIds = (node.attrs.tagIds as string[]) ?? [];
      return false;
    }
    return true;
  });

  const html = editor.getHTML();
  const body = stripMarkerFromHtml(html);
  const isEmptyBody =
    new DOMParser()
      .parseFromString(body, "text/html")
      .body.textContent?.trim().length === 0;

  return { body, tagIds, isEmptyBody };
}

function stripMarkerFromHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc
    .querySelectorAll("[data-tagged-marker], [data-task-suggestion-marker]")
    .forEach((el) => el.remove());
  return doc.body.innerHTML;
}
