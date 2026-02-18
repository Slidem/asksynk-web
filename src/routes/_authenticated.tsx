import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";

import { Box, Center, Loader } from "@mantine/core";
import { Navbar } from "@/app/components/Navbar/Navbar";
import { useSession } from "@/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function buildRedirectTarget(location: {
  pathname: string;
  search: Record<string, unknown>;
  hash: string;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(location.search)) {
    if (value === undefined || value === null) continue;
    params.append(key, String(value));
  }
  const searchString = params.toString();
  const normalizedSearch = searchString ? `?${searchString}` : "";
  return `${location.pathname}${normalizedSearch}${location.hash || ""}`;
}

function AuthenticatedLayout() {
  const { data, isPending } = useSession();
  const location = useRouterState({ select: (s) => s.location });
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;

    if (!data) {
      const redirectTarget = buildRedirectTarget(location);
      navigate({
        to: "/signin",
        search: { redirect: redirectTarget, verified: undefined },
      });
      return;
    }

    if (!data.user?.emailVerified) {
      const redirectTarget = buildRedirectTarget(location);
      navigate({ to: "/verify-email", search: { redirect: redirectTarget } });
    }
  }, [data, isPending, location, navigate]);

  if (isPending) {
    return (
      <Center h="100vh" w="100vw">
        <Loader />
      </Center>
    );
  }

  if (!data || !data.user?.emailVerified) {
    return null;
  }

  return (
    <Box style={{ display: "flex" }}>
      <Navbar />
      <Box
        component="main"
        style={{ flex: 1, padding: "var(--mantine-spacing-md)" }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
