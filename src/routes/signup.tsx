import {
  Alert,
  Anchor,
  Button,
  Card,
  Container,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import type { FormEvent } from "react";
import { authClient } from "@/auth";

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
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch({
    select: (search) => ({
      redirect: search.redirect?.startsWith("/")
        ? search.redirect
        : "/dashboard",
    }),
  });
  const emailVerificationCallback = `/signin?${new URLSearchParams({
    redirect: redirectTo,
    verified: "1",
  }).toString()}`;
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
  });

  const isMagicMode = mode === "magic";
  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return isMagicMode ? "Sending link..." : "Creating account...";
    }
    return isMagicMode ? "Send magic link" : "Create account";
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
        const { error, data } = await authClient.signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
          callbackURL: emailVerificationCallback,
        });
        if (error) {
          setFormError(error.message || "");
        } else {
          if (data.user.emailVerified) {
            navigate({ to: redirectTo });
          } else {
            console.info(
              "Email not verified, redirecting to verify email page",
            );
            navigate({
              to: "/verify-email",
              search: { redirect: redirectTo },
            });
          }
        }
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <Stack gap="xs" align="center">
          <Title order={2}>Create your account</Title>
          <Text size="sm" c="dimmed">
            Join asksynk and get started in minutes.
          </Text>
        </Stack>

        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={500}>Sign up</Text>
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
                Check your email to finish sign up.
              </Alert>
            ) : null}

            <form onSubmit={handleSubmit}>
              <Stack gap="sm">
                <TextInput
                  label="Name"
                  value={values.name}
                  onChange={(event) => {
                    const name = event.currentTarget.value;
                    setValues((prev) => ({ ...prev, name }));
                  }}
                  required
                />
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

                {isMagicMode ? null : (
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
            Already have an account?
          </Text>
          <Anchor href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}>
            Sign in
          </Anchor>
        </Group>
      </Stack>
    </Container>
  );
}
