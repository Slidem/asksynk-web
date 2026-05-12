import { useSession } from "@/auth";
import { useMemo } from "react";

export function getMyDisplayName(sessionUser?: {
  name?: string;
  email?: string;
}) {
  if (!sessionUser) return "You";

  if (sessionUser.name) {
    return sessionUser.name;
  }

  if (sessionUser.email) {
    return sessionUser.email;
  }

  return "You";
}

export function useGetMyDisplayName() {
  const sessionUser = useSessionUser();
  return useMemo(() => getMyDisplayName(sessionUser), [sessionUser]);
}

export function useSessionUser() {
  const { data: session } = useSession();
  return session?.user;
}
