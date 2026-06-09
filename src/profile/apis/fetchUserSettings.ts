import { apiFetch, buildApiUrl } from "@/lib/api";
import type { UserSettingsDto } from "@/profile/models/userSettings";

export async function fetchUserSettings() {
  const response = await apiFetch(buildApiUrl("/user-settings"));

  if (!response.ok) {
    throw new Error("Failed to load settings");
  }

  return response.json() as Promise<UserSettingsDto>;
}
