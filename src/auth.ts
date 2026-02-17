import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

const rawBaseURL = import.meta.env.VITE_BETTER_AUTH_URL;

if (!rawBaseURL) {
  throw new Error("VITE_BETTER_AUTH_URL is required");
}

const normalizedBaseURL = rawBaseURL.replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL: normalizedBaseURL,
  plugins: [magicLinkClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession } = authClient;
