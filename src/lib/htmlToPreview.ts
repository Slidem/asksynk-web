export function htmlToPreview(html: string, maxLength = 80): string {
  if (!html) return "";
  const text =
    new DOMParser()
      .parseFromString(html, "text/html")
      .body.textContent?.replace(/\s+/g, " ")
      .trim() ?? "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
