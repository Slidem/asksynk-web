import { useNavigate } from "@tanstack/react-router";

import { useCreateOrGetThread } from "@/messages/hooks/mutations/useCreateOrGetThread";
import { useCallback } from "react";

export function useStartTaggedThread() {
  const navigate = useNavigate();
  const { startThread, isStarting } = useCreateOrGetThread();

  const start = useCallback(
    async (recipientUserId: string, tagIds: string[]) => {
      await startThread(recipientUserId, async ({ threadId }) => {
        await navigate({
          to: "/messages/$threadId",
          params: { threadId },
          search: tagIds.length > 0 ? { initialTagIds: tagIds } : {},
        });
      });
    },
    [navigate, startThread],
  );

  return { start, isStarting };
}
