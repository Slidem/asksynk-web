import { Box, Group, Text } from "@mantine/core";
import { useTimer } from "@/timer/hooks/queries/useTimer";
import { useTimerSettings } from "@/timer/hooks/queries/useTimerSettings";
import { formatClockTime } from "@/timer/utils/formatTimeblock";

/** Above this, dots get too wide — text only. */
const MAX_CADENCE_DOTS = 12;

/** Session strip: start time, focus count, long-break cadence, auto-end time. */
export function TimerSessionSummary() {
  const { data: timer } = useTimer();
  const { data: settings } = useTimerSettings();
  const session = timer?.session;

  if (!timer || !session) {
    return (
      <Text size="sm" c="dimmed">
        No active session · start focus to begin
      </Text>
    );
  }

  const interval = session.settings.longBreakInterval;
  const countdown = timer.focusBlocksUntilLongBreak ?? interval;
  const filled = Math.max(0, interval - countdown);
  const blocks = session.completedFocusBlocks;
  const timeoutSeconds = settings?.inactivityTimeoutSeconds ?? null;
  const autoEndsAt =
    timer.status !== "running" && timeoutSeconds !== null && timer.lastActivityAt
      ? new Date(new Date(timer.lastActivityAt).getTime() + timeoutSeconds * 1000)
      : null;

  return (
    <Group gap={8} justify="center" wrap="wrap">
      <Text size="sm" c="dimmed">
        Session · since {formatClockTime(new Date(session.startedAt))} · {blocks}{" "}
        focus {blocks === 1 ? "block" : "blocks"}
      </Text>
      {interval <= MAX_CADENCE_DOTS && (
        <Group gap={4} aria-hidden>
          {Array.from({ length: interval }, (_, i) => (
            <Box
              key={i}
              w={8}
              h={8}
              style={{
                borderRadius: "50%",
                backgroundColor:
                  i < filled
                    ? "var(--mantine-primary-color-filled)"
                    : "var(--mantine-color-default-border)",
              }}
            />
          ))}
        </Group>
      )}
      <Text size="sm" c="dimmed">
        {countdown === 0 ? "long break next" : `${countdown} until long break`}
        {autoEndsAt ? ` · auto-ends ${formatClockTime(autoEndsAt)} if idle` : ""}
      </Text>
    </Group>
  );
}
