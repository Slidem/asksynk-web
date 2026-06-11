import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import { getProvider } from "@/integrations/models/provider";
import { useCalendarIntegrations } from "@/integrations/hooks/queries/useCalendarIntegrations";
import { calendarIntegrationsQueryKey } from "@/integrations/hooks/queries/useCalendarIntegrationsQueryData";
import { useOpenManageIntegrationDialog } from "@/integrations/hooks/dialogs/manageIntegrationDialogHooks";

/**
 * Handles the OAuth return on `/integrations?connected=<provider>`:
 * toasts success, refetches integrations, opens the new integration's
 * configure dialog, and clears the search param.
 */
export function useHandleOAuthReturn() {
  const { connected } = useSearch({ from: "/_authenticated/integrations" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const openManage = useOpenManageIntegrationDialog();
  const { data: integrations } = useCalendarIntegrations();

  const handledRef = useRef<string | null>(null);
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);

  // Step 1: react to the `connected` param once, then clear it.
  useEffect(() => {
    if (!connected || handledRef.current === connected) return;
    handledRef.current = connected;

    const provider = getProvider(connected);
    notifications.show({
      color: "green",
      title: "Connected",
      message: `${provider?.label ?? connected} is connected. Choose which calendars to sync.`,
    });
    queryClient.invalidateQueries({ queryKey: calendarIntegrationsQueryKey });
    setPendingProvider(connected);
    navigate({
      to: "/integrations",
      search: { connected: undefined },
      replace: true,
    });
  }, [connected, navigate, queryClient]);

  // Step 2: once integrations load, open the matching integration's dialog.
  useEffect(() => {
    if (!pendingProvider || !integrations) return;
    const match = integrations.find((i) => i.provider === pendingProvider);
    if (match) {
      openManage(match.id);
      setPendingProvider(null);
    }
  }, [pendingProvider, integrations, openManage]);
}
