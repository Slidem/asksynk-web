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
}
