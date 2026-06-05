import { formatDuration } from "@/timer/utils/formatDuration";
import classes from "./TimerDisplay.module.css";

interface TimerDisplayProps {
  seconds: number;
  fontSize: string | number;
  color?: string;
  pulse?: boolean;
}

export function TimerDisplay({
  seconds,
  fontSize,
  color,
  pulse,
}: TimerDisplayProps) {
  const className = [classes.display, pulse && classes.pulse]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} style={{ fontSize, color }}>
      {formatDuration(Math.ceil(seconds))}
    </span>
  );
}
