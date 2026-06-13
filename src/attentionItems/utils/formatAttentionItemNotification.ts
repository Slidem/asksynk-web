import type {
  AttentionItemDto,
  AttentionItemType,
} from "@/attentionItems/models/attentionItem";
import { htmlToPreview } from "@/lib/htmlToPreview";

interface AttentionNotificationContent {
  title: string;
  body: string;
}

const TITLE_BY_TYPE: Record<AttentionItemType, string> = {
  tagged_message: "New tagged message",
  incoming_email: "New email",
  slack_message: "New Slack message",
  whatsapp_message: "New WhatsApp message",
  suggested_timeblock: "Suggested timeblock",
  task: "New task",
  suggested_task: "Suggested task",
};

// Toast shows the (near-)full message; cap for readable UX. Content may be
// TipTap HTML, so htmlToPreview strips tags → plain text before capping.
const MAX_BODY = 280;

export function formatAttentionItemNotification(
  item: AttentionItemDto,
): AttentionNotificationContent {
  const title = TITLE_BY_TYPE[item.type] ?? "New item needs attention";
  const raw = bodyText(item);
  return { title, body: htmlToPreview(raw, MAX_BODY) };
}

function bodyText(item: AttentionItemDto): string {
  switch (item.metadata.type) {
    case "tagged_message":
      return item.metadata.content;
    case "task":
    case "suggested_task":
      return item.metadata.title;
    default:
      return item.note ?? "";
  }
}
