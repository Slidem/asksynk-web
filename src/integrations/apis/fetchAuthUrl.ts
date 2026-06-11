import { apiFetch, buildApiUrl } from "@/lib/api";
import type { AuthUrlResponse } from "@/integrations/models/calendarIntegration";

export async function fetchAuthUrl(provider: string): Promise<AuthUrlResponse> {
  const params = new URLSearchParams({ provider });
  const response = await apiFetch(
    buildApiUrl(`/calendar-integrations/auth-url?${params.toString()}`),
  );

  if (!response.ok) {
    throw new Error("Failed to start connection");
  }

  return response.json();
}
