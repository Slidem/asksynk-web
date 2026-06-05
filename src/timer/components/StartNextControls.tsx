import { Button, Group } from "@mantine/core";
import { IconBrain, IconCoffee } from "@tabler/icons-react";
import { useTimerController } from "@/timer/hooks/useTimerController";
import { StartNextButton } from "./StartNextButton";

interface StartNextControlsProps {
  size?: "sm" | "md" | "lg" | "xl";
  iconSize?: number;
  buttonSize?: "xs" | "sm" | "md" | "lg" | "xl";
}

/** Inactive controls: play the suggested next session + a text button for the alternative. */
export function StartNextControls({
  size = "xl",
  iconSize = 26,
  buttonSize = "md",
}: StartNextControlsProps) {
  const { alternate, switchToAlternate, isPending } = useTimerController();

  const altIcon =
    alternate?.sessionType === "focus" ? (
      <IconBrain size={18} />
    ) : (
      <IconCoffee size={18} />
    );

  return (
    <Group gap="md" justify="center">
      <StartNextButton size={size} iconSize={iconSize} />
      {alternate && (
        <Button
          size={buttonSize}
          radius="xl"
          variant="light"
          leftSection={altIcon}
          onClick={switchToAlternate}
          loading={isPending}
        >
          {alternate.label}
        </Button>
      )}
    </Group>
  );
}
