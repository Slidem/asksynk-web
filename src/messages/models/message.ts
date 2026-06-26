export type SenderKind = "user" | "guest";

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
}
