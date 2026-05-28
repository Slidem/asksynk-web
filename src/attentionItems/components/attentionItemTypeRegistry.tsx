import type { ComponentType } from "react";
import { IconBell, IconMessage } from "@tabler/icons-react";

import type {
  AttentionItemDto,
  AttentionItemMetadata,
  AttentionItemType,
  TaggedMessageMetadata,
} from "@/attentionItems/models/attentionItem";
import { htmlToPreview } from "@/lib/htmlToPreview";

import { TaggedMessageBody } from "./bodies/TaggedMessageBody";
import { UnknownTypeBody } from "./bodies/UnknownTypeBody";

type IconComponent = ComponentType<{ size?: number | string }>;

interface AttentionItemTypeConfig<
  M extends AttentionItemMetadata = AttentionItemMetadata,
> {
  Icon: IconComponent;
  Body: ComponentType<{ item: AttentionItemDto; metadata: M }>;
  getDisplayTitle: (metadata: M) => string;
}

const TYPE_LABELS: Record<AttentionItemType, string> = {
  tagged_message: "Tagged message",
  incoming_email: "Incoming email",
  slack_message: "Slack message",
  whatsapp_message: "WhatsApp message",
  suggested_timeblock: "Suggested timeblock",
  suggested_task: "Suggested task",
};

const TAGGED_MESSAGE_CONFIG: AttentionItemTypeConfig<TaggedMessageMetadata> = {
  Icon: IconMessage,
  Body: TaggedMessageBody,
  getDisplayTitle: (m) => htmlToPreview(m.content, 80) || "Empty message",
};

const UNKNOWN_CONFIG: AttentionItemTypeConfig = {
  Icon: IconBell,
  Body: UnknownTypeBody,
  getDisplayTitle: (m) => TYPE_LABELS[m.type] ?? "Attention item",
};

const REGISTRY: Partial<
  Record<AttentionItemType, AttentionItemTypeConfig<any>>
> = {
  tagged_message: TAGGED_MESSAGE_CONFIG,
};

export function getAttentionItemConfig(
  type: AttentionItemType,
): AttentionItemTypeConfig<any> {
  return REGISTRY[type] ?? UNKNOWN_CONFIG;
}
