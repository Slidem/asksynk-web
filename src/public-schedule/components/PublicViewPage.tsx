import {
  Center,
  Container,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

import { PublicMessagesPanel } from "@/public-schedule/components/PublicMessagesPanel";
import { PublicYourItemsPanel } from "@/public-schedule/components/PublicYourItemsPanel";
import { PublicScheduleCalendar } from "@/public-schedule/components/PublicScheduleCalendar";
import { PublicViewLayout } from "@/public-schedule/components/PublicViewLayout";
import { PublicViewSignInForm } from "@/public-schedule/components/PublicViewSignInForm";
import { PublicViewTabs } from "@/public-schedule/components/PublicViewTabs";
import type { PublicViewTab } from "@/public-schedule/models/publicViewTab";
import {
  useGuestSession,
  useGuestSessionHandlers,
} from "@/public-schedule/hooks/useGuestSession";
import { usePublicViewQuery } from "@/public-schedule/hooks/queries/usePublicViewQuery";
import { useSession } from "@/auth";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";
import { PublicViewRedirectToApp } from "./PublicViewRedirectToApp";

interface Props {
  slug: string;
  tab: PublicViewTab;
}

export function PublicViewPage({ slug, tab }: Props) {
  const [stayOnPublicView, setStayOnPublicView] = useState(false);

  const {
    data: view,
    isLoading: isGuestSessionLoading,
    isError: isGuestSessionError,
    error: guestSessionError,
  } = usePublicViewQuery(slug);

  const { data: networkConnections, isError: isNetworkConnectionsError } =
    useNetworkConnectionsQuery();

  const { data: session, isPending: isSessionLoading } = useSession();
  const guestSession = useGuestSession();

  const isOwnerOfView = session && session.user.id === view?.ownerUserId;

  const isViewOfAConnection =
    view &&
    !isNetworkConnectionsError &&
    networkConnections?.some((conn) => conn.userId === view.ownerUserId);

  const isSessionLoaded = session && !isSessionLoading;

  const { clear } = useGuestSessionHandlers();

  useEffect(() => {
    if (guestSession && guestSession.slug !== slug) {
      clear();
    }
  }, [guestSession, slug, clear]);

  if (isGuestSessionLoading || isSessionLoading) {
    return (
      <Center h="100vh" w="100%">
        <Loader />
      </Center>
    );
  }

  if (isGuestSessionError || !view) {
    return (
      <Container size="sm" py="xl">
        <Paper p="lg" withBorder radius="lg">
          <Stack gap="sm">
            <Title order={3}>Link unavailable</Title>
            <Text c="dimmed">
              {(guestSessionError as Error | null)?.message ??
                "This view does not exist, has expired, or was revoked."}
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (
    !stayOnPublicView &&
    isSessionLoaded &&
    (isOwnerOfView || isViewOfAConnection)
  ) {
    return (
      <PublicViewRedirectToApp
        isYourView={!!isOwnerOfView}
        isAConnectionView={!!isViewOfAConnection}
        onStayOnPublicView={() => setStayOnPublicView(true)}
      />
    );
  }

  if (!guestSession || guestSession.slug !== slug) {
    return <PublicViewSignInForm view={view} />;
  }

  return (
    <PublicViewLayout
      view={view}
      tabs={<PublicViewTabs slug={slug} activeTab={tab} />}
    >
      {tab === "calendar" && (
        <PublicScheduleCalendar slug={slug} ownerUserId={view.ownerUserId} />
      )}
      {tab === "pending" && <PublicYourItemsPanel slug={slug} view={view} />}
      {tab === "messages" && <PublicMessagesPanel slug={slug} view={view} />}
    </PublicViewLayout>
  );
}
