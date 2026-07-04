import { apiFetch, buildApiUrl } from "@/lib/api";
import type { Message } from "@/messages/models/message";

export interface FetchPublicThreadMessagesInput {
  before?: string;
  limit?: number;
}

// Guest's single thread with the view owner; the thread is inferred from the
// guest session token, so no threadId is passed.
export async function fetchPublicThreadMessages({
  before,
  limit,
}: FetchPublicThreadMessagesInput): Promise<Message[]> {
  const params = new URLSearchParams();
  if (before) {
    params.set("before", before);
  }
  if (limit) {
    params.set("limit", String(limit));
  }

  const queryString = params.toString();
  let path = "/public/thread/messages";
  if (queryString) {
    path += `?${queryString}`;
  }

  const response = await apiFetch(buildApiUrl(path), {
    allowGuestSession: true,
  });

  if (!response.ok) {
    throw new Error("Failed to load messages");
  }
  return response.json();
}
