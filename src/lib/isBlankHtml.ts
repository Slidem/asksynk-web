// True for empty rich-text: tiptap emits "<p></p>" for an empty doc, which is
// truthy and would otherwise be saved as a non-empty description.
export function isBlankHtml(html: string | null | undefined): boolean {
  if (!html) return true;
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length === 0;
}
