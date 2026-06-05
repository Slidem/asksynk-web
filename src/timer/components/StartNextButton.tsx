import { ActionIcon } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import { useTimerController } from "@/timer/hooks/useTimerController";
import { sessionTypeLabel } from "@/timer/models/timer";

interface StartNextButtonProps {
  size?: "sm" | "md" | "lg" | "xl";
  iconSize?: number;
}

export function StartNextButton({
  size = "lg",
  iconSize = 22,
}: StartNextButtonProps) {
  const { next, startNext, canStartNext, isPending } = useTimerController();

  return (
    <ActionIcon
      size={size}
      radius="xl"
      variant="filled"
      onClick={startNext}
      loading={isPending}
      disabled={!canStartNext}
      aria-label={next ? `Start ${sessionTypeLabel(next.sessionType)}` : "Start"}
      data-no-drag
    >
      <IconPlayerPlay size={iconSize} />
    </ActionIcon>
  );
}
