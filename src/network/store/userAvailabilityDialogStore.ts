import { create } from "zustand";

import type { NetworkConnectionDto } from "@/network/models/networkConnection";

interface State {
  opened: boolean;
  user: NetworkConnectionDto | null;
  open: (user: NetworkConnectionDto) => void;
  close: () => void;
}

export const useUserAvailabilityDialogStore = create<State>((set) => ({
  opened: false,
  user: null,
  open: (user) => set({ opened: true, user }),
  close: () => set({ opened: false }),
}));
