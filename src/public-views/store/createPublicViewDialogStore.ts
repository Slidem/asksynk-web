import { create } from "zustand";

interface Props {
  opened: boolean;
  open: () => void;
  close: () => void;
}

export const useCreatePublicViewDialogStore = create<Props>((set) => ({
  opened: false,
  open: () => set({ opened: true }),
  close: () => set({ opened: false }),
}));
