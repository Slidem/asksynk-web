import { create } from "zustand";

interface Props {
  publicViewId: string | null;
  open: (publicViewId: string) => void;
  close: () => void;
}

export const usePublicViewGuestsDialogStore = create<Props>((set) => ({
  publicViewId: null,
  open: (publicViewId) => set({ publicViewId }),
  close: () => set({ publicViewId: null }),
}));
