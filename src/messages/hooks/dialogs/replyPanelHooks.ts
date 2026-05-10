import { useReplyPanelStore } from "@/messages/store/replyPanelStore";
import { useShallow } from "zustand/shallow";

export const useReplyPanelHandlers = () => {
  return useReplyPanelStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useReplyPanelOpenMessageId = () => {
  return useReplyPanelStore((state) => state.openMessageId);
};
