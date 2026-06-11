import { create } from "zustand";

type Step = "select" | "connect";

interface AddIntegrationDialogState {
  opened: boolean;
  step: Step;
  providerId: string | null;
  open: () => void;
  selectProvider: (providerId: string) => void;
  back: () => void;
  close: () => void;
}

export const useAddIntegrationDialogStore = create<AddIntegrationDialogState>(
  (set) => ({
    opened: false,
    step: "select",
    providerId: null,
    open: () => set({ opened: true, step: "select", providerId: null }),
    selectProvider: (providerId) => set({ step: "connect", providerId }),
    back: () => set({ step: "select", providerId: null }),
    close: () => set({ opened: false }),
  }),
);
