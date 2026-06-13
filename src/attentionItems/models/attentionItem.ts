export type AttentionItemStatus = "created" | "in_progress" | "resolved";

export type AttentionItemType =
  | "tagged_message"
  | "incoming_email"
  | "slack_message"
  | "whatsapp_message"
  | "suggested_timeblock"
  | "task"
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

export interface TaskMetadata {
  type: "task";
  title: string;
  taskId?: string;
  taskBatchId?: string;
}

export interface SuggestedTaskMetadata {
  type: "suggested_task";
  suggestionId: string;
  suggesterUserId: string;
  title: string;
}

export interface UnknownAttentionItemMetadata {
  type: Exclude<
    AttentionItemType,
    "tagged_message" | "task" | "suggested_task"
  >;
}

export type AttentionItemMetadata =
  | TaggedMessageMetadata
  | TaskMetadata
  | SuggestedTaskMetadata
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
