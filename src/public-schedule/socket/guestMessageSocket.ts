import { apiBaseUrl } from "@/lib/api";
import type { ManagedStatus, Message } from "@/messages/models/message";
import { getGuestToken } from "@/public-schedule/store/guestSessionStore";
import { io, type Socket } from "socket.io-client";

export interface GuestSendMessageAck {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export interface GuestTagMessageAck {
  ok: boolean;
  error?: string;
}

interface ServerToClient {
  // Server infers the guest's single thread; threadId is echoed back on the message.
  "message.created": (payload: { message: Message }) => void;
  // Readonly status sync for the guest's tagged messages (owner resolves).
  "message.status.updated": (payload: {
    threadId: string;
    messageId: string;
    managedStatus: ManagedStatus;
  }) => void;
}

interface ClientToServer {
  // tagIds are the owner's tags the guest applied (routing barrier). Only the
  // guest tags; the owner replies untagged.
  "message.send": (
    payload: { body: string; tagIds: string[] },
    ack: (response: GuestSendMessageAck) => void,
  ) => void;
  // Re-tag one of the guest's own already-sent messages.
  "message.tag": (
    payload: { messageId: string; tagIds: string[] },
    ack: (response: GuestTagMessageAck) => void,
  ) => void;
}

export type GuestMessageSocket = Socket<ServerToClient, ClientToServer>;

let socket: GuestMessageSocket | null = null;

// TODO(missingApis): ASK-12 — guest-scoped `message.send` handler + the gateway
// authenticating the guest from the Authorization header (see missingApis/ASK-12.md).
//
// Browsers can't attach custom headers to a raw WebSocket handshake, so the
// guest Bearer token (same credential as guestApiFetch) only reaches the server
// if the handshake uses HTTP polling. We allow polling for the handshake, then
// let it upgrade to websocket for messaging.
export function connectGuestMessageSocket(): GuestMessageSocket {
  if (socket) {
    return socket;
  }

  socket = io(apiBaseUrl, {
    transports: ["polling", "websocket"],
    extraHeaders: { Authorization: `Bearer ${getGuestToken()}` },
  });

  return socket;
}

export function disconnectGuestMessageSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export function getGuestMessageSocket(): GuestMessageSocket | null {
  return socket;
}
