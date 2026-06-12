import type { TagDto, TagNotificationSettings } from "@/tags/models/tag";

// Most-permissive merge: a setting is on if ANY tag enables it.
// No tags → both off → silent.
export function mergeTagNotificationSettings(
  tags: TagDto[],
): TagNotificationSettings {
  return {
    browserNotificationEnabled: tags.some(
      (t) => t.notificationsSettings.browserNotificationEnabled,
    ),
    soundNotificationEnabled: tags.some(
      (t) => t.notificationsSettings.soundNotificationEnabled,
    ),
  };
}
