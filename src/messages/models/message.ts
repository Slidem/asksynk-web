export type SenderKind = "user" | "guest";

export interface Message {
  id: string;
  threadId: string;
  senderKind: SenderKind;
  senderId: string;
  body: string;
  tagIds: string[];
  createdAt: string;
}
