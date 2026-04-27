import {
  useGuestSessionStore,
  type GuestSession,
} from "@/public-schedule/store/guestSessionStore";
import { useShallow } from "zustand/shallow";

export const useGuestSession = (): GuestSession | null => {
  return useGuestSessionStore((s) => s.session);
};

export const useGuestSessionHandlers = () => {
  return useGuestSessionStore(
    useShallow((s) => ({ setSession: s.setSession, clear: s.clear })),
  );
};
