import {
  useNetworkTabStore,
  type NetworkTab,
} from "@/network/store/networkTabStore";
import { useShallow } from "zustand/shallow";

export const useNetworkTab = (): NetworkTab => {
  return useNetworkTabStore((s) => s.tab);
};

export const useNetworkTabHandlers = () => {
  return useNetworkTabStore(useShallow((s) => ({ setTab: s.setTab })));
};
