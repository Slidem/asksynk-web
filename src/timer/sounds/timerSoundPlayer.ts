import { SOUND_FILES, type TimerSoundType } from "./soundTypes";
import { useTimerSoundSettingsStore } from "./useTimerSoundSettingsStore";

const cache = new Map<TimerSoundType, HTMLAudioElement>();

function getAudio(type: TimerSoundType): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;

  let el = cache.get(type);
  if (!el) {
    el = new Audio(SOUND_FILES[type]);
    el.preload = "auto";
    cache.set(type, el);
  }
  return el;
}

export function preloadTimerSounds() {
  (Object.keys(SOUND_FILES) as TimerSoundType[]).forEach((type) => {
    getAudio(type)?.load();
  });
}

export function playTimerSound(type: TimerSoundType) {
  const { enabled, volume } = useTimerSoundSettingsStore.getState();
  if (!enabled) return;

  const el = getAudio(type);
  if (!el) return;

  el.volume = volume;
  el.currentTime = 0;
  // Missing file / autoplay block → reject silently; never throw.
  void el.play().catch(() => {});
}
