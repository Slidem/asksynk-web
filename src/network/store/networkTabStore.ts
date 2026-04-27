import { create } from "zustand";

export type NetworkTab = "connections" | "received" | "sent";

interface Props {
  tab: NetworkTab;
  setTab: (tab: NetworkTab) => void;
}

export const useNetworkTabStore = create<Props>((set) => ({
  tab: "connections",
  setTab: (tab) => set({ tab }),
}));
