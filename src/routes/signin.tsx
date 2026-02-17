import { createFileRoute, redirect } from "@tanstack/react-router";

import SignIn from "@/signin/components/SignIn";
import { authClient } from "@/auth";

export const Route = createFileRoute("/signin")({
  validateSearch: (search: Record<string, string | undefined>) => ({
    redirect: search.redirect,
    verified: search.verified,
  }),
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: SignIn,
});
