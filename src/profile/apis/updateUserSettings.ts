import { apiFetch, buildApiUrl } from "@/lib/api";
import type { UserSettingsDto } from "@/profile/models/userSettings";

export async function updateUserSettings(input: UserSettingsDto) {
  const response = await apiFetch(buildApiUrl("/user-settings"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to update settings");
  }

  return response.json() as Promise<UserSettingsDto>;
}
