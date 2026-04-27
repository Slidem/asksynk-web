import { create } from "zustand";

const STORAGE_KEY = "asksynk.guest";

export interface GuestSession {
  token: string;
  guestId: string;
  displayName: string;
  publicViewOwnerId: string;
  publicViewId: string;
  slug: string;
  expiresAt: string;
}

interface Props {
  session: GuestSession | null;
  setSession: (session: GuestSession) => void;
  clear: () => void;
}

function readFromStorage(): GuestSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuestSession;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export const useGuestSessionStore = create<Props>((set) => ({
  session: readFromStorage(),
  setSession: (session) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    set({ session });
  },
  clear: () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    set({ session: null });
  },
}));

export function getGuestToken(): string | null {
  return useGuestSessionStore.getState().session?.token ?? null;
}
