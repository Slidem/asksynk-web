import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TagUpdateInput, TagDto } from "../models/tag";

export async function updateTag(input: TagUpdateInput) {
  const response = await apiFetch(buildApiUrl(`/tags/${input.id}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      description: input.description,
      color: input.color,
      answerMode: input.answerMode,
      notificationsSettings: input.notificationsSettings,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update tag");
  }

  return response.json() as Promise<TagDto>;
}
