export type AttentionItemStatus = "created" | "in_progress" | "resolved";

// Open string: future channels (gmail, slack…) add kinds without an API change.
export type AttentionSourceKind =
  | "message"
  | "task"
  | "task_batch"
  | "task_suggestion"
  | (string & {});

export interface AttentionSource {
  context: string;
  kind: AttentionSourceKind;
  id: string;
}

export interface AttentionActor {
  kind: "user" | "guest";
  id: string;
}

export interface AttentionPreview {
  title: string;
  body: string | null;
  actor: AttentionActor | null;
  // message: { threadId }
  meta: Record<string, string>;
}

export interface AttentionItemDto {
  id: string;
  userId: string;
  source: AttentionSource;
  preview: AttentionPreview;
  status: AttentionItemStatus;
  tagIds: string[];
  dueDate: string | null;
  dueDatePinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttentionItemListFilters {
  status?: AttentionItemStatus;
  sourceKind?: AttentionSourceKind;
  cursor?: string;
  limit?: number;
}
