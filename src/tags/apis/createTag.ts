import { apiFetch, buildApiUrl } from "@/lib/api";
import type { TagCreateInput, TagDto } from "../models/tag";

export async function createTag(input: TagCreateInput) {
  const response = await apiFetch(buildApiUrl("/tags"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create tag");
  }

  return response.json() as Promise<TagDto>;
}
