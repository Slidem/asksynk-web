import { connectMessageSocket } from "@/messages/socket/messageSocket";
import {
  modeLabel,
  type Timer,
  type TimerCompletedEvent,
  type TimerSessionEndedEvent,
} from "@/timer/models/timer";
import { useTimer } from "@/timer/hooks/queries/useTimer";
import { timerQueryKey } from "@/timer/hooks/queries/useTimerQueryData";
import { useTimerSettings } from "@/timer/hooks/queries/useTimerSettings";
import { useTimerTransitions } from "@/timer/hooks/queries/useTimerTransitions";
import { useTimerRuntimeStore } from "@/timer/store/timerRuntimeStore";
import {
  playTimerSound,
  preloadTimerSounds,
} from "@/timer/sounds/timerSoundPlayer";
import { applyTriggers } from "@/timer/utils/timerMachine";
import { refreshTimer } from "@/timer/utils/refreshTimer";
import { showBrowserNotification } from "@/lib/browserNotification";
import { useQueryClient } from "@tanstack/react-query";
import { IconCircleCheck, IconInfoCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  createElement,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
} from "react";

const RUNNING_TICK_MS = 250;
const ENDING_SOON_SECONDS = 60;
const ENDING_SOON_FRACTION = 0.1;

function completionMessage(payload: TimerCompletedEvent): string {
  return payload.mode === "focus"
    ? "Nice work. Time for a break."
    : "Break complete. Ready to focus?";
}

const SESSION_ENDED_MESSAGES: Partial<
  Record<TimerSessionEndedEvent["reason"], string>
> = {
  inactivity: "Session ended after inactivity.",
  settings_changed: "Session reset — timer settings changed.",
};

/**
 * Single global timer engine: owns the countdown tick, the socket listeners,
 * and the sound/notification side-effects. Writes only `nowMs` to the runtime
 * store (no React state) so ticks never re-render the layout — only the leaf
 * digit/bar components that subscribe to `nowMs`.
 */
export function useTimerEngine() {
  const { data: timer } = useTimer();
  // Warm the transition table + settings before the first command.
  const { data: transitions } = useTimerTransitions();
  const { data: settings } = useTimerSettings();
  const queryClient = useQueryClient();
  const setNowMs = useTimerRuntimeStore((s) => s.setNowMs);
  const status = timer?.status;
  const endingSoonFiredRef = useRef(false);

  // Reads live timer data but isn't reactive to it: lets the interval stay
  // alive across block boundaries while always seeing the latest values.
  const onTick = useEffectEvent(() => {
    const now = Date.now();
    setNowMs(now);

    if (
      timer?.status !== "running" ||
      !timer.completesAt ||
      !timer.blockDurationSeconds
    ) {
      return;
    }

    const remaining = (new Date(timer.completesAt).getTime() - now) / 1000;

    if (remaining <= 0) {
      endingSoonFiredRef.current = false;
      // Local 00:00: switch to the completed state now (no pause offered).
      // Not refetched here — `timer.completed` confirms it from the server.
      if (transitions) {
        queryClient.setQueryData<Timer>(timerQueryKey(), (current) =>
          current ? applyTriggers(current, transitions, settings, now) : current,
        );
      }
      return;
    }

    const isEndingSoon =
      remaining <= ENDING_SOON_SECONDS ||
      remaining / timer.blockDurationSeconds <= ENDING_SOON_FRACTION;

    // Re-arm on leaving the window, not on `completesAt` changes — the
    // optimistic → server `completesAt` swap would otherwise fire it twice.
    if (!isEndingSoon) {
      endingSoonFiredRef.current = false;
    } else if (!endingSoonFiredRef.current) {
      endingSoonFiredRef.current = true;
      playTimerSound("endingSoon");
    }
  });

  useEffect(() => {
    preloadTimerSounds();
  }, []);

  useEffect(() => {
    if (status === "idle" || status === "completed") {
      endingSoonFiredRef.current = false;
    }
  }, [status]);

  // Layout effect: `nowMs` must be current before the first running frame
  // paints, or the display flashes a stale value.
  useLayoutEffect(() => {
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
      const title = `${modeLabel(payload.mode)} complete`;
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
      refreshTimer(queryClient);
    };

    const handleSessionEnded = (payload: TimerSessionEndedEvent) => {
      const message = SESSION_ENDED_MESSAGES[payload.reason];
      if (message) {
        notifications.show({
          color: "gray",
          message,
          icon: createElement(IconInfoCircle, { size: 18 }),
          autoClose: 6000,
        });
      }
      refreshTimer(queryClient);
    };

    const handleConnect = () => {
      refreshTimer(queryClient);
    };

    socket.on("timer.completed", handleCompleted);
    socket.on("timer.session_ended", handleSessionEnded);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("timer.completed", handleCompleted);
      socket.off("timer.session_ended", handleSessionEnded);
      socket.off("connect", handleConnect);
    };
  }, [queryClient]);
}
