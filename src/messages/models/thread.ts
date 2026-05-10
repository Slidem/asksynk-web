import type { SenderKind } from "@/messages/models/message";

export interface ThreadUserParticipant {
  kind: "user";
  userId: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
  isActiveConnection: boolean;
}

export interface ThreadGuestParticipant {
  kind: "guest";
  guestId: string;
  displayName: string;
  publicViewId: string;
  publicViewName: string | null;
  publicViewExpired: boolean;
}

export type ThreadOtherParticipant =
  | ThreadUserParticipant
  | ThreadGuestParticipant;

export interface ThreadLastMessage {
  body: string;
  createdAt: string;
  senderKind: SenderKind;
}

export interface ThreadListItem {
  threadId: string;
  publicViewId: string | null;
  other: ThreadOtherParticipant;
  lastMessage: ThreadLastMessage | null;
  frozen: boolean;
  createdAt: string;
}
