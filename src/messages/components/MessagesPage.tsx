import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Outlet, useParams } from "@tanstack/react-router";
import { NewThreadDialog } from "@/messages/components/NewThreadDialog";
import { ThreadList } from "@/messages/components/ThreadList";
import { useMessageSocket } from "@/messages/hooks/useMessageSocket";

export function MessagesPage() {
  useMessageSocket();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const params = useParams({ strict: false });
  const hasThread = !!params.threadId;

  const containerStyle = {
    height: "calc(100vh - 2 * var(--mantine-spacing-md))",
    border: "1px solid var(--mantine-color-default-border)",
    borderRadius: 8,
    overflow: "hidden",
  } as const;

  if (isDesktop) {
    return (
      <Box style={{ display: "flex", ...containerStyle }}>
        <Box
          style={{
            width: 320,
            borderRight: "1px solid var(--mantine-color-default-border)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <ThreadList />
        </Box>
        <Box
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Outlet />
        </Box>
        <NewThreadDialog />
      </Box>
    );
  }

  return (
    <Box
      style={{
        ...containerStyle,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {hasThread ? <Outlet /> : <ThreadList />}
      <NewThreadDialog />
    </Box>
  );
}
