import { useState } from "react";
import { notifications } from "@mantine/notifications";

import { fetchAuthUrl } from "@/integrations/apis/fetchAuthUrl";

/** Starts the OAuth connect flow: fetches the consent URL and redirects the browser. */
export function useConnectProvider() {
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async (providerId: string) => {
    setIsConnecting(true);
    try {
      const { url } = await fetchAuthUrl(providerId);
      window.location.href = url;
    } catch (error) {
      setIsConnecting(false);
      notifications.show({
        color: "red",
        title: "Could not connect",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  return { connect, isConnecting };
}
