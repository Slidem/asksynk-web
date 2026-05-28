import {
  getGuestToken,
  useGuestSessionStore,
} from "@/public-schedule/store/guestSessionStore";
import { GuestUnauthorizedError } from "@/public-schedule/utils/guestApiFetch";
import { isOnPublicView } from "./public";

const rawApiURL = import.meta.env.VITE_API_URL;

if (!rawApiURL) {
  throw new Error("VITE_API_URL is required");
}

export const apiBaseUrl = rawApiURL.replace(/\/$/, "");

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiBaseUrl}${normalizedPath}`;
}

type FetchOptions = RequestInit & {
  allowGuestSession?: boolean;
};

export async function apiFetch(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const fetchOptions: FetchOptions = {
    ...options,
    credentials: options.credentials ?? "include",
    headers: {
      ...options.headers,
    },
  };

  if (options.allowGuestSession && isOnPublicView()) {
    const token = getGuestToken();

    if (!token) {
      useGuestSessionStore.getState().clear();
      throw new GuestUnauthorizedError();
    }

    fetchOptions.credentials = "omit";
    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return fetch(url, fetchOptions);
}
