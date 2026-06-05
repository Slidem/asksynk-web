import { Center } from "@mantine/core";
import { useSidebarTimerVisible } from "@/timer/hooks/useSidebarTimerVisible";
import { SidebarTimerButton } from "./SidebarTimerButton";

/**
 * Gate kept separate from the content so the ticking `useTimerView`
 * subscription only mounts while the sidebar surface is actually live.
 */
export function SidebarTimer() {
  const visible = useSidebarTimerVisible();
  if (!visible) return null;

  return (
    <Center>
      <SidebarTimerButton />
    </Center>
  );
}
