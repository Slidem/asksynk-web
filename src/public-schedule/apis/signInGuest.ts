import { apiFetch, buildApiUrl } from "@/lib/api";
import type {
  GuestSignInInput,
  GuestSignInResult,
} from "@/public-schedule/models/publicView";

export async function signInGuest(
  slug: string,
  input: GuestSignInInput,
): Promise<GuestSignInResult> {
  const response = await apiFetch(
    buildApiUrl(`/public/views/${slug}/sign-in`),
    {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? "Failed to sign in");
  }

  return response.json();
}
