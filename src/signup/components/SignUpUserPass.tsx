import { Alert, PasswordInput, Stack, TextInput } from "@mantine/core";
import { memo, useCallback, useState, type SubmitEvent } from "react";

import SignUpFormContainer from "./SignUpFormContainer";
import { authClient } from "@/auth";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  redirectTo: string;
  setMode: (mode: "password" | "magic") => void;
}

const SignUpUserPass = ({ redirectTo, setMode }: Props) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const emailVerificationCallback = `${window.location.origin}/signin?${new URLSearchParams(
    {
      redirect: redirectTo,
      verified: "1",
    },
  ).toString()}`;

  const handleSubmit = useCallback(
    async (event: SubmitEvent) => {
      event.preventDefault();
      setFormError(null);
      setIsSubmitting(true);

      try {
        const { error, data } = await authClient.signUp.email({
          name,
          email,
          password,
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
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Sign up failed");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, emailVerificationCallback, navigate, password, redirectTo, name],
  );

  const renderAlert = useCallback(
    () => <SignUpUserPassAlert formError={formError} />,
    [formError],
  );

  const renderForm = useCallback(
    () => (
      <SignUpUserPassForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
      />
    ),
    [email, password, name],
  );

  return (
    <SignUpFormContainer
      mode="password"
      setMode={setMode}
      renderAlert={renderAlert}
      renderForm={renderForm}
      submitLabel="Create account"
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
    />
  );
};

const SignUpUserPassForm = memo(
  ({
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
  }: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    name: string;
    setName: (name: string) => void;
  }) => {
    return (
      <Stack gap="sm">
        <TextInput
          label="Name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          required
        />
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
        />
      </Stack>
    );
  },
);

const SignUpUserPassAlert = memo(
  ({ formError }: { formError: string | null }) => {
    return formError ? (
      <Alert color="red" variant="light">
        {formError}
      </Alert>
    ) : null;
  },
);

export default SignUpUserPass;
