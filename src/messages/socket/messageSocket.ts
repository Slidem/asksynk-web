import { apiBaseUrl } from "@/lib/api";
import { io, type Socket } from "socket.io-client";
import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { Message } from "@/messages/models/message";
import type {
  TaskSuggestion,
  TaskSuggestionCreatePayload,
} from "@/tasks/models/taskSuggestion";
import type { TimerCompletedEvent } from "@/timer/models/timer";

export interface SendMessageAck {
  ok: boolean;
  messageId?: string;
  /** Set when the message carried a task suggestion; links the inline card. */
  suggestionId?: string;
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
  // Fired to BOTH participants when a thread suggestion's status or any of its
  // materialized tasks' status changes — keeps the inline card live both ways.
  "suggestion.updated": (payload: { suggestion: TaskSuggestion }) => void;
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
      // Backend creates the suggestion (suggestee = thread's other participant)
      // + the recipient's attention item, and links suggestionId to the message.
      taskSuggestion?: TaskSuggestionCreatePayload;
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
