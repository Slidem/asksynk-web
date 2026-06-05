export type TimerSoundType =
  | "start"
  | "pause"
  | "resume"
  | "stop"
  | "complete"
  | "endingSoon";

/** Served from `public/` at the web root. Provide these files to enable audio. */
export const SOUND_FILES: Record<TimerSoundType, string> = {
  start: "/sounds/timer/start.mp3",
  pause: "/sounds/timer/pause.mp3",
  resume: "/sounds/timer/resume.mp3",
  stop: "/sounds/timer/stop.mp3",
  complete: "/sounds/timer/complete.mp3",
  endingSoon: "/sounds/timer/ending-soon.mp3",
};
