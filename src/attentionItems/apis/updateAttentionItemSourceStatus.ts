import type {
  AttentionItemDto,
  AttentionItemStatus,
} from "@/attentionItems/models/attentionItem";
import { getMessageSocket } from "@/messages/socket/messageSocket";
import { updateTask } from "@/tasks/apis/updateTask";
import type { TaskStatus } from "@/tasks/models/task";

const TASK_STATUS_BY_ITEM_STATUS: Record<AttentionItemStatus, TaskStatus> = {
  created: "todo",
  in_progress: "in_progress",
  resolved: "completed",
};

// Items are read-only projections: status changes go to the source; the item
// follows via `attention.upserted`. Only message + task sources support it.
export async function updateAttentionItemSourceStatus(
  item: AttentionItemDto,
  status: AttentionItemStatus,
): Promise<void> {
  switch (item.source.kind) {
    case "message":
      return updateMessageStatus(item.source.id, status);
    case "task":
      await updateTask({
        id: item.source.id,
        status: TASK_STATUS_BY_ITEM_STATUS[status],
      });
      return;
    default:
      throw new Error(`Unsupported source kind "${item.source.kind}"`);
  }
}

function updateMessageStatus(
  messageId: string,
  status: AttentionItemStatus,
): Promise<void> {
  const socket = getMessageSocket();
  if (!socket) return Promise.reject(new Error("Not connected"));

  return new Promise((resolve, reject) => {
    socket.emit("message.updateStatus", { messageId, status }, (ack) =>
      ack.ok
        ? resolve()
        : reject(new Error(ack.error ?? "Failed to update message status")),
    );
  });
}
