// Tagged-message stats + search for the public DM view (ASK-12).
// Status maps the owner's attention item: resolved = owner resolved it,
// pending = anything not yet resolved (created/in_progress).
export type PublicTaggedMessageStatus = "resolved" | "pending";

export interface PublicTaggedMessageTag {
  id: string;
  name: string;
  color: string;
}

export interface PublicTaggedMessage {
  messageId: string;
  tag: PublicTaggedMessageTag;
  preview: string;
  status: PublicTaggedMessageStatus;
  createdAt: string;
}

export interface PublicTaggedMessageStats {
  resolved: number;
  pending: number;
}
