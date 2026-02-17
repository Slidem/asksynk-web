import type { MantineColorSchemeManager } from "@mantine/core";

export function cookieColorSchemeManager(
  cookieKey = "asksynk-color-scheme",
): MantineColorSchemeManager {
  return {
    get: (defaultValue) => {
      if (typeof document === "undefined") {
        return defaultValue;
      }
      const match = document.cookie.match(
        new RegExp(`(^| )${cookieKey}=([^;]+)`),
      );
      const value = match?.[2];
      if (value === "light" || value === "dark" || value === "auto") {
        return value;
      }
      return defaultValue;
    },
    set: (value) => {
      document.cookie = `${cookieKey}=${value};max-age=31536000;path=/;SameSite=Lax`;
    },
    subscribe: () => () => {},
    unsubscribe: () => {},
    clear: () => {
      document.cookie = `${cookieKey}=;max-age=-1;path=/`;
    },
  };
}
