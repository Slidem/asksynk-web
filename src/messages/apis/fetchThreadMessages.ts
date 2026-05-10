import { apiFetch, buildApiUrl } from "@/lib/api";
import type { Message } from "@/messages/models/message";

export interface FetchThreadMessagesInput {
  threadId: string;
  before?: string;
  limit?: number;
}

export async function fetchThreadMessages({
  threadId,
  before,
  limit,
}: FetchThreadMessagesInput): Promise<Message[]> {
  const params = new URLSearchParams();

  if (before) {
    params.set("before", before);
  }
  if (limit) {
    params.set("limit", String(limit));
  }

  const queryString = params.toString();

  let path = `/threads/${threadId}/messages`;

  if (queryString) {
    path += `?${queryString}`;
  }

  const response = await apiFetch(buildApiUrl(path));

  if (!response.ok) {
    throw new Error("Failed to load messages");
  }
  return response.json();
}
