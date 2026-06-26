import type { TaskStatus } from "@/tasks/models/task";

export type SuggestionStatus = "pending" | "accepted" | "rejected";

export type SuggestionKind = "task" | "batch";

export type SuggestionRole = "sent" | "received";

// Tasks created when a suggestion is accepted. Carries live status so both the
// suggester and the suggestee can see progress (the suggester never has these in
// their own ['tasks'] cache).
export interface MaterializedTask {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface SuggestionTaskChild {
  title: string;
  description?: string;
}

// dueDate applies to both kinds (batch-level for batches). tagIds are the
// SUGGESTEE's tags; on accept they carry over to the materialized task/batch.
export interface TaskSuggestionPayload {
  kind: SuggestionKind;
  title: string;
  description: string | null;
  dueDate: string | null;
  tagIds: string[];
  tasks: SuggestionTaskChild[]; // kind="batch" only
}

export interface TaskSuggestion {
  id: string;
  suggesterUserId: string;
  suggesteeUserId: string;
  status: SuggestionStatus;
  payload: TaskSuggestionPayload;
  // Present once accepted; lets both sides render per-task progress + check off.
  materializedTasks?: MaterializedTask[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskSuggestionCreatePayload {
  kind: SuggestionKind;
  title: string;
  description?: string;
  dueDate?: string;
  tagIds?: string[];
  tasks?: SuggestionTaskChild[]; // kind="batch"
}

export interface TaskSuggestionCreateInput {
  suggesteeUserId: string;
  payload: TaskSuggestionCreatePayload;
}

// PATCH has two exclusive modes: respond ({status}) or payload edit. Mixing
// status with payload fields is a 400, hence two input types.
export interface TaskSuggestionRespondInput {
  id: string;
  status: "accepted" | "rejected";
}

export interface TaskSuggestionPayloadEditInput {
  id: string;
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  tagIds?: string[];
  tasks?: SuggestionTaskChild[];
}
