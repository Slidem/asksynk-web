import type { TagDto } from "@/tags/models/tag";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface Props {
  selectedTag: TagDto | null;
  opened: boolean;
  open: (tag: TagDto) => void;
  close: () => void;
}

export const useEditTagDialogStore = create<Props>()(
  subscribeWithSelector((set) => ({
    selectedTag: null,
    opened: false,
    open: (tag: TagDto) => set({ selectedTag: tag, opened: true }),
    close: () => set({ selectedTag: null, opened: false }),
  })),
);
