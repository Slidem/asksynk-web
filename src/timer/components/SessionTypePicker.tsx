import { Button, Group } from "@mantine/core";
import { useStartTimer } from "@/timer/hooks/mutations/useStartTimer";
import { useNextSession } from "@/timer/hooks/useNextSession";
import { useTimerSettings } from "@/timer/hooks/queries/useTimerSettings";
import { sessionDurationSeconds, type SessionType } from "@/timer/models/timer";

const SESSION_OPTIONS: { type: SessionType; label: string }[] = [
  { type: "focus", label: "Focus" },
  { type: "short_break", label: "Short break" },
  { type: "long_break", label: "Long break" },
];

interface SessionTypePickerProps {
  size?: "xs" | "sm" | "md" | "lg";
}

export function SessionTypePicker({ size = "sm" }: SessionTypePickerProps) {
  const startMutation = useStartTimer();
  const { data: settings } = useTimerSettings();
  const { next } = useNextSession();

  const handleStart = (sessionType: SessionType) => {
    if (!settings) return;
    startMutation.mutate({
      sessionType,
      durationSeconds: sessionDurationSeconds(settings, sessionType),
    });
  };

  return (
    <Group gap="xs" justify="center">
      {SESSION_OPTIONS.map((option) => {
        const minutes = settings
          ? Math.round(sessionDurationSeconds(settings, option.type) / 60)
          : null;
        const isNext = next?.sessionType === option.type;

        return (
          <Button
            key={option.type}
            size={size}
            variant={isNext ? "filled" : "light"}
            radius="xl"
            onClick={() => handleStart(option.type)}
            loading={startMutation.isPending}
            disabled={!settings}
          >
            {minutes != null ? `${option.label} · ${minutes}m` : option.label}
          </Button>
        );
      })}
    </Group>
  );
}
