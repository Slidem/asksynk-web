interface BrowserNotificationInput {
  title: string;
  body: string;
}

export function canUseNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (!canUseNotifications()) return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export function showBrowserNotification({
  title,
  body,
}: BrowserNotificationInput) {
  if (!canUseNotifications()) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body });
  } catch {
    // Some platforms throw when constructing Notification directly; ignore.
  }
}
