import type { ComponentType } from "react";
import {
  IconBell,
  IconChecklist,
  IconClipboardCheck,
  IconMessage,
} from "@tabler/icons-react";

import type {
  AttentionItemDto,
  AttentionSourceKind,
} from "@/attentionItems/models/attentionItem";

import { SuggestedTaskBody } from "./bodies/SuggestedTaskBody";
import { TaggedMessageBody } from "./bodies/TaggedMessageBody";
import { TaskBody } from "./bodies/TaskBody";
import { UnknownTypeBody } from "./bodies/UnknownTypeBody";

type IconComponent = ComponentType<{ size?: number | string }>;

interface AttentionItemKindConfig {
  Icon: IconComponent;
  Body: ComponentType<{ item: AttentionItemDto }>;
}

const MESSAGE_CONFIG: AttentionItemKindConfig = {
  Icon: IconMessage,
  Body: TaggedMessageBody,
};

const TASK_CONFIG: AttentionItemKindConfig = {
  Icon: IconChecklist,
  Body: TaskBody,
};

const TASK_SUGGESTION_CONFIG: AttentionItemKindConfig = {
  Icon: IconClipboardCheck,
  Body: SuggestedTaskBody,
};

// Unknown kinds (future channels) render generically from `preview`.
const UNKNOWN_CONFIG: AttentionItemKindConfig = {
  Icon: IconBell,
  Body: UnknownTypeBody,
};

const REGISTRY: Partial<Record<AttentionSourceKind, AttentionItemKindConfig>> =
  {
    message: MESSAGE_CONFIG,
    task: TASK_CONFIG,
    task_batch: TASK_CONFIG,
    task_suggestion: TASK_SUGGESTION_CONFIG,
  };

export function getAttentionItemConfig(
  kind: AttentionSourceKind,
): AttentionItemKindConfig {
  return REGISTRY[kind] ?? UNKNOWN_CONFIG;
}
