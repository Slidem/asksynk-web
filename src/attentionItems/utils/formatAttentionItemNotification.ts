import type {
  AttentionItemDto,
  AttentionSourceKind,
} from "@/attentionItems/models/attentionItem";
import { htmlToPreview } from "@/lib/htmlToPreview";

interface AttentionNotificationContent {
  title: string;
  body: string;
}

const TITLE_BY_KIND: Partial<Record<AttentionSourceKind, string>> = {
  message: "New tagged message",
  task: "New task",
  task_batch: "New task batch",
  task_suggestion: "Suggested task",
};

// Toast shows the (near-)full message; cap for readable UX. Content may be
// TipTap HTML, so htmlToPreview strips tags → plain text before capping.
const MAX_BODY = 280;

export function formatAttentionItemNotification(
  item: AttentionItemDto,
): AttentionNotificationContent {
  const title = TITLE_BY_KIND[item.source.kind] ?? "New item needs attention";
  const raw = item.preview.body ?? item.preview.title;
  return { title, body: htmlToPreview(raw, MAX_BODY) };
}
