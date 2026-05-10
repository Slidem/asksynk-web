import { connectMessageSocket } from "@/messages/socket/messageSocket";
import { useEffect } from "react";

export function useThreadSubscription(threadId: string | null) {
  useEffect(() => {
    if (!threadId) return;
    const socket = connectMessageSocket();

    const subscribe = () => {
      socket.emit("thread.subscribe", { threadId }, () => {});
    };

    if (socket.connected) {
      subscribe();
    }

    socket.on("connect", subscribe);

    return () => {
      socket.off("connect", subscribe);
      if (socket.connected) {
        socket.emit("thread.unsubscribe", { threadId }, () => {});
      }
    };
  }, [threadId]);
}
