import { create } from "zustand";

interface Props {
  openMessageId: string | null;
  open: (messageId: string) => void;
  close: () => void;
}

export const useReplyPanelStore = create<Props>((set) => ({
  openMessageId: null,
  open: (messageId) => set({ openMessageId: messageId }),
  close: () => set({ openMessageId: null }),
}));
