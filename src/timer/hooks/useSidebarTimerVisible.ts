import { useAmbientTimerVisible } from "@/timer/hooks/useAmbientTimerVisible";
import { useFloatingTimerHiddenStore } from "@/timer/store/floatingTimerHiddenStore";

export function useSidebarTimerVisible(): boolean {
  const ambient = useAmbientTimerVisible();
  const hidden = useFloatingTimerHiddenStore((s) => s.hidden);
  return ambient && hidden;
}
