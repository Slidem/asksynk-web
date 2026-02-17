import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/auth";
import SignUp from "@/signup/components/SignUp";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, string | undefined>) => ({
    redirect: search.redirect,
  }),
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: SignUp,
});
