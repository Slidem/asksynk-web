import {
  connectMessageSocket,
  disconnectMessageSocket,
} from "@/messages/socket/messageSocket";
import { useEffect } from "react";

/**
 * Owns the shared socket.io connection for the authenticated session.
 * Connects on mount, disconnects on unmount. Feature hooks
 * (useMessageSocket, useTimerEngine) only add/remove their own listeners.
 */
export function useAppSocketConnection() {
  useEffect(() => {
    connectMessageSocket();
    return () => {
      disconnectMessageSocket();
    };
  }, []);
}
