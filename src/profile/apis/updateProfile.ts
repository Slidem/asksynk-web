import { apiFetch, buildApiUrl } from "@/lib/api";
import type { ProfileDto, ProfileUpdateInput } from "@/profile/models/profile";

export async function updateProfile(input: ProfileUpdateInput) {
  const body: ProfileUpdateInput = {};

  if ("phone" in input) {
    body.phone = input.phone;
  }

  if ("avatarAttachmentId" in input) {
    body.avatarAttachmentId = input.avatarAttachmentId;
  }

  const response = await apiFetch(buildApiUrl("/profile"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json() as Promise<ProfileDto>;
}
