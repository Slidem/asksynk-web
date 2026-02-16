import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

const rawBaseURL = import.meta.env.VITE_BETTER_AUTH_URL;

if (!rawBaseURL) {
  throw new Error("VITE_BETTER_AUTH_URL is required");
}

const normalizedBaseURL = rawBaseURL.replace(/\/$/, "");
const apiBaseURL = `${normalizedBaseURL}/api/auth`;
const shouldProxy =
  import.meta.env.DEV &&
  typeof window !== "undefined" &&
  (() => {
    try {
      return new URL(normalizedBaseURL).origin !== window.location.origin;
    } catch {
      return false;
    }
  })();

const baseURL = shouldProxy
  ? new URL("/api/auth", window.location.origin).toString()
  : apiBaseURL;

export const authClient = createAuthClient({
  baseURL,
  plugins: [magicLinkClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession } = authClient;
