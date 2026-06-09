import { apiFetch, buildApiUrl } from "@/lib/api";
import type { ProfileDto } from "@/profile/models/profile";

export async function fetchProfile() {
  const response = await apiFetch(buildApiUrl("/profile"));

  if (!response.ok) {
    throw new Error("Failed to load profile");
  }

  return response.json() as Promise<ProfileDto>;
}
