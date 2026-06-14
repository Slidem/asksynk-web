const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

// Plain-text excerpt of tiptap rich-text HTML for compact previews: drop tags
// (as spaces so block boundaries don't merge words), decode common entities,
// collapse whitespace. Empty for null/blank (see isBlankHtml).
export function htmlToText(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, (m) => ENTITIES[m])
    .replace(/\s+/g, " ")
    .trim();
}
