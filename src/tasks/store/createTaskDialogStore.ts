import { create } from "zustand";

interface Props {
  opened: boolean;
  presetBatchId?: string;
  open: (presetBatchId?: string) => void;
  close: () => void;
}

export const useCreateTaskDialogStore = create<Props>((set) => ({
  opened: false,
  presetBatchId: undefined,
  open: (presetBatchId) => set({ opened: true, presetBatchId }),
  close: () => set({ opened: false, presetBatchId: undefined }),
}));
