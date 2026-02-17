import {
  Alert,
  Anchor,
  Button,
  Card,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import type { FormEvent } from "react";
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
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo, verified } = Route.useSearch({
    select: (search) => ({
      redirect: search.redirect?.startsWith("/")
        ? search.redirect
        : "/dashboard",
      verified: search.verified === "1",
    }),
  });
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [showVerified, setShowVerified] = useState(verified);
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
  });

  useEffect(() => {
    if (!verified) {
      return;
    }
    setShowVerified(true);
    const timer = window.setTimeout(() => {
      setShowVerified(false);
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [verified]);

  const isMagicMode = mode === "magic";
  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return isMagicMode ? "Sending link..." : "Signing in...";
    }
    return isMagicMode ? "Send magic link" : "Sign in";
  }, [isMagicMode, isSubmitting]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setMagicSent(false);
    setIsSubmitting(true);

    try {
      if (isMagicMode) {
        const { error } = await authClient.signIn.magicLink({
          email: values.email,
          name: values.name || undefined,
          callbackURL: redirectTo,
        });
        if (error) {
          setFormError(error.message || "");
        } else {
          setMagicSent(true);
        }
      } else {
        const { error } = await authClient.signIn.email({
          email: values.email,
          password: values.password,
          callbackURL: redirectTo,
        });
        if (error) {
          setFormError(error.message || "");
        } else {
          const { data } = await authClient.getSession();
          if (data?.user?.emailVerified) {
            navigate({ to: redirectTo });
          } else {
            navigate({
              to: "/verify-email",
              search: { redirect: redirectTo },
            });
          }
        }
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <Stack gap="xs" align="center">
          <Title order={2}>Welcome back</Title>
          <Text size="sm" c="dimmed">
            Sign in to continue to asksynk.
          </Text>
        </Stack>

        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={500}>Sign in</Text>
              <Group gap="xs">
                <Button
                  size="xs"
                  variant={isMagicMode ? "subtle" : "light"}
                  onClick={() => setMode("password")}
                >
                  Password
                </Button>
                <Button
                  size="xs"
                  variant={isMagicMode ? "light" : "subtle"}
                  onClick={() => setMode("magic")}
                >
                  Magic link
                </Button>
              </Group>
            </Group>

            {formError ? (
              <Alert color="red" variant="light">
                {formError}
              </Alert>
            ) : null}

            {magicSent ? (
              <Alert color="green" variant="light">
                Check your email for a sign in link.
              </Alert>
            ) : null}

            {showVerified ? (
              <Paper
                radius="md"
                p="md"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(230, 245, 255, 0.95), rgba(220, 255, 236, 0.95))",
                  border: "1px solid rgba(90, 200, 120, 0.35)",
                  boxShadow: "0 12px 28px rgba(35, 150, 100, 0.12)",
                }}
              >
                <Stack gap={6}>
                  <Text fw={600} size="sm">
                    Email verified
                  </Text>
                  <Text size="sm" c="dimmed">
                    Your account is verified. Sign in to continue.
                  </Text>
                </Stack>
              </Paper>
            ) : null}

            <form onSubmit={handleSubmit}>
              <Stack gap="sm">
                <TextInput
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(event) => {
                    const email = event.currentTarget.value;
                    setValues((prev) => ({
                      ...prev,
                      email,
                    }));
                  }}
                  required
                />

                {isMagicMode ? (
                  <TextInput
                    label="Name"
                    description="Used if this is your first sign in."
                    value={values.name}
                    onChange={(event) => {
                      const name = event.currentTarget.value;
                      setValues((prev) => ({
                        ...prev,
                        name,
                      }));
                    }}
                  />
                ) : (
                  <PasswordInput
                    label="Password"
                    value={values.password}
                    onChange={(event) => {
                      const password = event.currentTarget.value;
                      setValues((prev) => ({
                        ...prev,
                        password,
                      }));
                    }}
                    required
                  />
                )}

                <Button type="submit" loading={isSubmitting} fullWidth>
                  {submitLabel}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Card>

        <Group justify="center" gap="xs">
          <Text size="sm" c="dimmed">
            New here?
          </Text>
          <Anchor href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}>
            Create an account
          </Anchor>
        </Group>
      </Stack>
    </Container>
  );
}
