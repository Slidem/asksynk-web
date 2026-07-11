import type { AttentionItemStatus } from "@/attentionItems/models/attentionItem";

export type SenderKind = "user" | "guest";

/** Present only on tagged messages; the resolvable state read directly off the message. */
export interface ManagedStatus {
  type: "tagged_message";
  status: AttentionItemStatus;
}

export interface Message {
  id: string;
  threadId: string;
  parentMessageId: string | null;
  senderKind: SenderKind;
  senderId: string;
  body: string;
  tagIds: string[];
  createdAt: string;
  replyCount: number;
  /** Immutable pointer to a task suggestion sent with this message, if any. */
  suggestionId: string | null;
  managedStatus?: ManagedStatus;
}
