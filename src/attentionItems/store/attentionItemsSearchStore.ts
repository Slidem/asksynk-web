import { create } from "zustand";

interface Props {
  query: string;
  setQuery: (query: string) => void;
}

export const useAttentionItemsSearchStore = create<Props>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
