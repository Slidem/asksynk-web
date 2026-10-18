import { useTimer } from "@/timer/hooks/queries/useTimer";
import { useTimerIdle } from "@/timer/hooks/useTimerIdle";
import { useLocation } from "@tanstack/react-router";

/** Routes with their own embedded timer surface — no ambient timer there. */
const HIDDEN_ROUTES = ["/timer", "/dashboard"];

/** Whether an ambient timer surface (floating or sidebar) should show at all. */
export function useAmbientTimerVisible(): boolean {
  const { pathname } = useLocation();
  const { data: timer } = useTimer();
  const isIdle = useTimerIdle();

  if (HIDDEN_ROUTES.includes(pathname)) return false;
  if (isIdle) return false;
  // Show while a session is open; hide once it ends or goes stale.
  return timer?.session != null;
}
