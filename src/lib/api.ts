import { authClient } from "@/auth";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const { data: session } = await authClient.getSession();

  if (!session) {
    throw new Error("User is not logged in");
  }

  return fetch(url, {
    ...options,
    credentials: options.credentials ?? "include",
    headers: {
      ...options.headers,
    },
  });
}
