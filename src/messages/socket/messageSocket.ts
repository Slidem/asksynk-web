import { apiBaseUrl } from "@/lib/api";
import { io, type Socket } from "socket.io-client";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { Message } from "@/messages/models/message";
import type { TimerCompletedEvent } from "@/timer/models/timer";

export interface SendMessageAck {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export interface SubscribeAck {
  ok: boolean;
  error?: string;
}

export interface TagMessageAck {
  ok: boolean;
  error?: string;
}

interface ServerToClient {
  "message.created": (payload: { threadId: string; message: Message }) => void;
  "message.updated": (payload: { threadId: string; message: Message }) => void;
  "attention.upserted": (payload: { item: AttentionItemDto }) => void;
  "attention.removed": (payload: { id: string }) => void;
  "timer.completed": (payload: TimerCompletedEvent) => void;
}

interface ClientToServer {
  "thread.subscribe": (
    payload: { threadId: string },
    ack: (response: SubscribeAck) => void,
  ) => void;
  "thread.unsubscribe": (
    payload: { threadId: string },
    ack: (response: SubscribeAck) => void,
  ) => void;
  "message.send": (
    payload: {
      threadId: string;
      body: string;
      tagIds: string[];
      parentMessageId?: string;
    },
    ack: (response: SendMessageAck) => void,
  ) => void;
  "message.tag": (
    payload: { messageId: string; tagIds: string[] },
    ack: (response: TagMessageAck) => void,
  ) => void;
}

export type MessageSocket = Socket<ServerToClient, ClientToServer>;

let socket: MessageSocket | null = null;

export function connectMessageSocket(): MessageSocket {
  if (socket) {
    return socket;
  }

  socket = io(apiBaseUrl, {
    withCredentials: true,
    transports: ["websocket"],
  });

  return socket;
}

export function disconnectMessageSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export function getMessageSocket(): MessageSocket | null {
  return socket;
}
