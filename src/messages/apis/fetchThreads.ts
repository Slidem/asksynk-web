import { apiFetch, buildApiUrl } from "@/lib/api";
import type { ThreadListItem } from "@/messages/models/thread";

export async function fetchThreads(): Promise<ThreadListItem[]> {
  const response = await apiFetch(buildApiUrl("/threads"));

  if (!response.ok) {
    throw new Error("Failed to load threads");
  }

  return response.json();
}
