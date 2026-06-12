const NOTIFICATION_SOUND = "/sounds/notification.mp3";

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;
  if (!audio) {
    audio = new Audio(NOTIFICATION_SOUND);
    audio.preload = "auto";
  }
  return audio;
}

export function preloadNotificationSound() {
  getAudio()?.load();
}

// Gating is per-tag (caller decides) — unlike the timer player, no global toggle.
export function playNotificationSound() {
  const el = getAudio();
  if (!el) return;
  el.currentTime = 0;
  // Missing file / autoplay block → reject silently; never throw.
  void el.play().catch(() => {});
}
