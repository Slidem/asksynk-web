import { apiFetch } from "@/lib/api";
import {
  getGuestToken,
  useGuestSessionStore,
} from "@/public-schedule/store/guestSessionStore";

export class GuestUnauthorizedError extends Error {
  constructor() {
    super("Guest session expired or revoked");
    this.name = "GuestUnauthorizedError";
  }
}

export async function guestApiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getGuestToken();

  if (!token) {
    useGuestSessionStore.getState().clear();
    throw new GuestUnauthorizedError();
  }

  const response = await apiFetch(url, {
    ...options,
    credentials: "omit",
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    useGuestSessionStore.getState().clear();
    throw new GuestUnauthorizedError();
  }

  return response;
}
