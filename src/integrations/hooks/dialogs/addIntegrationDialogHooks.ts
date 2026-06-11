import { useShallow } from "zustand/shallow";

import { useAddIntegrationDialogStore } from "@/integrations/store/addIntegrationDialogStore";

export const useAddIntegrationDialogState = () => {
  return useAddIntegrationDialogStore(
    useShallow((state) => ({
      opened: state.opened,
      step: state.step,
      providerId: state.providerId,
    })),
  );
};

export const useAddIntegrationDialogHandlers = () => {
  return useAddIntegrationDialogStore(
    useShallow((state) => ({
      open: state.open,
      selectProvider: state.selectProvider,
      back: state.back,
      close: state.close,
    })),
  );
};

export const useOpenAddIntegrationDialog = () => {
  return useAddIntegrationDialogStore((state) => state.open);
};
