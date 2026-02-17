import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/auth";
import VerifyEmail from "@/verify-email/components/VerifyEmail";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, string | undefined>) => ({
    redirect: search.redirect,
  }),

  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data?.user?.emailVerified) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: VerifyEmail,
});
