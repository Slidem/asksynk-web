import type { TagDto } from "@/tags/models/tag";
import { useEditTagDialogStore } from "@/tags/store/editTagDialogStore";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

export const useEditTagDialogHandlers = () => {
  return useEditTagDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsEditTagDialogOpened = () => {
  return useEditTagDialogStore((state) => state.opened);
};

export const useOpenedEditTag = () => {
  return useEditTagDialogStore((state) => state.selectedTag);
};

export const useOnSelectedEditedTagChange = (
  callback: (tag: TagDto | null) => void,
) => {
  const callBackRef = useRef(callback);
  useEffect(() => {
    const unsubscribe = useEditTagDialogStore.subscribe(
      (state) => state.selectedTag,
      (selectedTag) => {
        callBackRef.current(selectedTag);
      },
    );
    return unsubscribe;
  }, []);
};
