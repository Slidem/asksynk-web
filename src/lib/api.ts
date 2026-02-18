const rawApiURL = import.meta.env.VITE_API_URL;

if (!rawApiURL) {
  throw new Error("VITE_API_URL is required");
}

export const apiBaseUrl = rawApiURL.replace(/\/$/, "");

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiBaseUrl}${normalizedPath}`;
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: options.credentials ?? "include",
    headers: {
      ...options.headers,
    },
  });
}
