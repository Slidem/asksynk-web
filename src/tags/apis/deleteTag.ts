import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TagDto } from "../models/tag";

export async function deleteTag(tagId: string) {
  const response = await apiFetch(buildApiUrl(`/tags/${tagId}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete tag");
  }

  return response.json() as Promise<TagDto>;
}
