import { create } from "zustand";

interface Props {
  opened: boolean;
  batchId?: string;
  open: (batchId: string) => void;
  close: () => void;
}

export const useTaskBatchDetailDialogStore = create<Props>((set) => ({
  opened: false,
  batchId: undefined,
  open: (batchId) => set({ opened: true, batchId }),
  close: () => set({ opened: false, batchId: undefined }),
}));
