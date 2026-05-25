export type AttentionItemStatus = "created" | "in_progress" | "resolved";

export type AttentionItemType =
  | "tagged_message"
  | "incoming_email"
  | "slack_message"
  | "whatsapp_message"
  | "suggested_timeblock"
  | "suggested_task";

export interface TaggedMessageMetadata {
  type: "tagged_message";
  messageId: string;
  threadId: string;
  senderId: string;
  senderType: "user" | "guest";
  content: string;
  originalTagIds: string[];
}

export interface UnknownAttentionItemMetadata {
  type: Exclude<AttentionItemType, "tagged_message">;
}

export type AttentionItemMetadata =
  | TaggedMessageMetadata
  | UnknownAttentionItemMetadata;

export interface AttentionItemDto {
  id: string;
  userId: string;
  type: AttentionItemType;
  status: AttentionItemStatus;
  dueDate: string | null;
  note: string | null;
  metadata: AttentionItemMetadata;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AttentionItemListFilters {
  status?: AttentionItemStatus;
  type?: AttentionItemType;
  cursor?: string;
  limit?: number;
}

export interface AttentionItemUpdateInput {
  id: string;
  status?: AttentionItemStatus;
  note?: string | null;
  tagIds?: string[];
}
