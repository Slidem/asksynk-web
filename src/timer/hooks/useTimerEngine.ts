import { connectMessageSocket } from "@/messages/socket/messageSocket";
import {
  sessionTypeLabel,
  type TimerCompletedEvent,
} from "@/timer/models/timer";
import { useTimer } from "@/timer/hooks/queries/useTimer";
import { timerQueryKey } from "@/timer/hooks/queries/useTimerQueryData";
import { timerSuggestionQueryKey } from "@/timer/hooks/queries/useTimerSuggestionQueryData";
import { useTimerRuntimeStore } from "@/timer/store/timerRuntimeStore";
import {
  playTimerSound,
  preloadTimerSounds,
} from "@/timer/sounds/timerSoundPlayer";
import { showBrowserNotification } from "@/lib/browserNotification";
import { useQueryClient } from "@tanstack/react-query";
import { IconCircleCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { createElement, useEffect, useEffectEvent, useRef } from "react";

const RUNNING_TICK_MS = 250;
const ENDING_SOON_SECONDS = 60;
const ENDING_SOON_FRACTION = 0.1;

function completionMessage(payload: TimerCompletedEvent): string {
  return payload.sessionType === "focus"
    ? "Nice work. Time for a break."
    : "Break complete. Ready to focus?";
}

/**
 * Single global timer engine: owns the countdown tick, the socket listeners,
 * and the sound/notification side-effects. Writes only `nowMs` to the runtime
 * store (no React state) so ticks never re-render the layout — only the leaf
 * digit/bar components that subscribe to `nowMs`.
 */
export function useTimerEngine() {
  const { data: timer } = useTimer();
  const queryClient = useQueryClient();
  const setNowMs = useTimerRuntimeStore((s) => s.setNowMs);
  const status = timer?.status;
  const completesAt = timer?.completesAt;
  const endingSoonFiredRef = useRef(false);

  // Reads live timer data but isn't reactive to it: lets the interval stay
  // alive across session boundaries while always seeing the latest values.
  const onTick = useEffectEvent(() => {
    const now = Date.now();
    setNowMs(now);

    if (
      timer?.status === "running" &&
      timer.completesAt &&
      timer.sessionDurationSeconds
    ) {
      const remaining = Math.max(
        0,
        (new Date(timer.completesAt).getTime() - now) / 1000,
      );

      const isEndingSoon =
        remaining <= ENDING_SOON_SECONDS ||
        remaining / timer.sessionDurationSeconds <= ENDING_SOON_FRACTION;

      if (isEndingSoon && remaining > 0 && !endingSoonFiredRef.current) {
        endingSoonFiredRef.current = true;
        playTimerSound("endingSoon");
      }
    }
  });

  useEffect(() => {
    preloadTimerSounds();
  }, []);

  // Re-arm the ending-soon alert at every session boundary (incl. a direct
  // running -> running transition, where `status` doesn't change).
  useEffect(() => {
    endingSoonFiredRef.current = false;
  }, [completesAt]);

  useEffect(() => {
    if (status !== "running") {
      setNowMs(Date.now());
      return;
    }

    onTick();

    const id = setInterval(onTick, RUNNING_TICK_MS);
    return () => clearInterval(id);
  }, [setNowMs, status]);

  useEffect(() => {
    const socket = connectMessageSocket();

    const handleCompleted = (payload: TimerCompletedEvent) => {
      playTimerSound("complete");
      const title = `${sessionTypeLabel(payload.sessionType)} complete`;
      const message = completionMessage(payload);
      notifications.show({
        color: "green",
        title,
        message,
        icon: createElement(IconCircleCheck, { size: 18 }),
        autoClose: 6000,
      });
      if (document.hidden) {
        showBrowserNotification({ title, body: message });
      }
      queryClient.invalidateQueries({ queryKey: timerQueryKey() });
      queryClient.invalidateQueries({ queryKey: timerSuggestionQueryKey() });
    };

    const handleConnect = () => {
      queryClient.invalidateQueries({ queryKey: timerQueryKey() });
    };

    socket.on("timer.completed", handleCompleted);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("timer.completed", handleCompleted);
      socket.off("connect", handleConnect);
    };
  }, [queryClient]);
}
