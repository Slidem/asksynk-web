import classes from "./TimerProgressBar.module.css";

interface TimerProgressBarProps {
  /** Elapsed progress 0..1. */
  fraction: number;
  color: string;
  pulse?: boolean;
  height?: number;
}

export function TimerProgressBar({
  fraction,
  color,
  pulse,
  height = 8,
}: TimerProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  const fillClassName = [classes.fill, pulse && classes.pulse]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes.track} style={{ height }}>
      <div
        className={fillClassName}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}
