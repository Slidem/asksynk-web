import { Container, Stack, Text, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import type { FormEvent } from "react";
import SignUpAlert from "./SignUpAlert";
import SignUpForm from "./SignUpForm";
import SignUpFormContainer from "./SignUpFormContainer";
import SignUpSignInCTA from "./SignUpSignInCTA";
import { authClient } from "@/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const { redirect: redirectParam } = useSearch({
    from: "/signup",
  });
  const redirectTo = redirectParam?.startsWith("/")
    ? redirectParam
    : "/dashboard";
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

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [
      emailVerificationCallback,
      isMagicMode,
      navigate,
      redirectTo,
      values.email,
      values.name,
      values.password,
    ],
  );

  const renderAlert = useCallback(
    () => <SignUpAlert formError={formError} magicSent={magicSent} />,
    [formError, magicSent],
  );

  const renderForm = useCallback(
    () => (
      <SignUpForm
        isMagicMode={isMagicMode}
        values={values}
        setValues={setValues}
      />
    ),
    [isMagicMode, values],
  );

  const submitLabel = isMagicMode ? "Send magic link" : "Create account";

  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <Stack gap="xs" align="center">
          <Title order={2}>Create your account</Title>
          <Text size="sm" c="dimmed">
            Join asksynk and get started in minutes.
          </Text>
        </Stack>

        <SignUpFormContainer
          mode={mode}
          setMode={setMode}
          renderAlert={renderAlert}
          renderForm={renderForm}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />

        <SignUpSignInCTA redirectTo={redirectTo} />
      </Stack>
    </Container>
  );
};

export default SignUp;
