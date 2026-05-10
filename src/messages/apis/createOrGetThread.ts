import { apiFetch, buildApiUrl } from "@/lib/api";

export interface CreateOrGetThreadInput {
  recipientUserId: string;
}

export interface CreateOrGetThreadResponse {
  threadId: string;
}

export async function createOrGetThread(
  input: CreateOrGetThreadInput,
): Promise<CreateOrGetThreadResponse> {
  const response = await apiFetch(buildApiUrl("/threads"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? "Failed to start conversation");
  }

  return response.json();
}
