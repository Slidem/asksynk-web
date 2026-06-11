import { create } from "zustand";

interface ManageIntegrationDialogState {
  opened: boolean;
  integrationId: string | null;
  open: (integrationId: string) => void;
  close: () => void;
}

export const useManageIntegrationDialogStore =
  create<ManageIntegrationDialogState>((set) => ({
    opened: false,
    integrationId: null,
    open: (integrationId) => set({ opened: true, integrationId }),
    close: () => set({ opened: false, integrationId: null }),
  }));
