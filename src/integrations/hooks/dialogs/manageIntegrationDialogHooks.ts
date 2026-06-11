import { useShallow } from "zustand/shallow";

import { useManageIntegrationDialogStore } from "@/integrations/store/manageIntegrationDialogStore";

export const useManageIntegrationDialogState = () => {
  return useManageIntegrationDialogStore(
    useShallow((state) => ({
      opened: state.opened,
      integrationId: state.integrationId,
    })),
  );
};

export const useOpenManageIntegrationDialog = () => {
  return useManageIntegrationDialogStore((state) => state.open);
};

export const useCloseManageIntegrationDialog = () => {
  return useManageIntegrationDialogStore((state) => state.close);
};
