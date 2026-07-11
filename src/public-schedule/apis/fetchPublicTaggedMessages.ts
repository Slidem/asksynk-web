import { apiFetch, buildApiUrl } from "@/lib/api";
import type { Message } from "@/messages/models/message";

// Full set of the guest's tagged messages (newest-first, replies included,
// managedStatus always set). Thread resolved from the guest session; no thread
// yet → [].
export async function fetchPublicTaggedMessages(): Promise<Message[]> {
  const response = await apiFetch(
    buildApiUrl("/public/thread/tagged-messages"),
    { allowGuestSession: true },
  );

  if (!response.ok) {
    throw new Error("Failed to load tagged messages");
  }
  return response.json();
}
