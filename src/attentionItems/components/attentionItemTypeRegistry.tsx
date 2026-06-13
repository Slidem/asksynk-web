import type { ComponentType } from "react";
import {
  IconBell,
  IconChecklist,
  IconClipboardCheck,
  IconMessage,
} from "@tabler/icons-react";

import type {
  AttentionItemDto,
  AttentionItemMetadata,
  AttentionItemType,
  SuggestedTaskMetadata,
  TaggedMessageMetadata,
  TaskMetadata,
} from "@/attentionItems/models/attentionItem";
import { htmlToPreview } from "@/lib/htmlToPreview";

import { SuggestedTaskBody } from "./bodies/SuggestedTaskBody";
import { TaggedMessageBody } from "./bodies/TaggedMessageBody";
import { TaskBody } from "./bodies/TaskBody";
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
  task: "Task",
  suggested_task: "Suggested task",
};

const TAGGED_MESSAGE_CONFIG: AttentionItemTypeConfig<TaggedMessageMetadata> = {
  Icon: IconMessage,
  Body: TaggedMessageBody,
  getDisplayTitle: (m) => htmlToPreview(m.content, 80) || "Empty message",
};

const TASK_CONFIG: AttentionItemTypeConfig<TaskMetadata> = {
  Icon: IconChecklist,
  Body: TaskBody,
  getDisplayTitle: (m) => m.title || "Task",
};

const SUGGESTED_TASK_CONFIG: AttentionItemTypeConfig<SuggestedTaskMetadata> = {
  Icon: IconClipboardCheck,
  Body: SuggestedTaskBody,
  getDisplayTitle: (m) => m.title || "Suggested task",
};

const UNKNOWN_CONFIG: AttentionItemTypeConfig = {
  Icon: IconBell,
  Body: UnknownTypeBody,
  getDisplayTitle: (m) => TYPE_LABELS[m.type] ?? "Attention item",
};

const REGISTRY: Partial<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<AttentionItemType, AttentionItemTypeConfig<any>>
> = {
  tagged_message: TAGGED_MESSAGE_CONFIG,
  task: TASK_CONFIG,
  suggested_task: SUGGESTED_TASK_CONFIG,
};

export function getAttentionItemConfig(
  type: AttentionItemType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): AttentionItemTypeConfig<any> {
  return REGISTRY[type] ?? UNKNOWN_CONFIG;
}
