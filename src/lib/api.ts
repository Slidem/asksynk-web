import { getOidc } from "@/oidc";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const oidc = await getOidc();

  if (!oidc.isUserLoggedIn) {
    throw new Error("User is not logged in");
  }

  const accessToken = await oidc.getAccessToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
