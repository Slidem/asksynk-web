import { Alert, Stack, TextInput } from "@mantine/core";
import { memo, useCallback, useState } from "react";

import SignUpFormContainer from "./SignUpFormContainer";
import type { SubmitEvent } from "react";
import { authClient } from "@/auth";

interface Props {
  redirectTo: string;
  setMode: (mode: "password" | "magic") => void;
}

const SignUpMagicLink = ({ redirectTo, setMode }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = useCallback(
    async (event: SubmitEvent) => {
      event.preventDefault();
      setFormError(null);
      setMagicSent(false);
      setIsSubmitting(true);

      try {
        const { error } = await authClient.signIn.magicLink({
          email,
          name: name || undefined,
          callbackURL: redirectTo,
        });
        if (error) {
          setFormError(error.message || "");
        } else {
          setMagicSent(true);
        }
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Sign up failed");
      } finally {
        setIsSubmitting(false);
      }
    },
    [redirectTo, email, name],
  );

  const renderAlert = useCallback(
    () => <SignUpMagicLinkAlert formError={formError} magicSent={magicSent} />,
    [formError, magicSent],
  );

  const renderForm = useCallback(
    () => (
      <SignUpMagicLinkForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
      />
    ),
    [name, email],
  );

  return (
    <SignUpFormContainer
      mode="magic"
      setMode={setMode}
      renderAlert={renderAlert}
      renderForm={renderForm}
      submitLabel="Send magic link"
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
    />
  );
};

const SignUpMagicLinkForm = memo(
  ({
    name,
    setName,
    email,
    setEmail,
  }: {
    name: string;
    setName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
  }) => {
    return (
      <Stack gap="sm">
        <TextInput
          label="Name"
          value={name}
          onChange={(event) => {
            setName(event.currentTarget.value);
          }}
          required
        />
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.currentTarget.value);
          }}
          required
        />
      </Stack>
    );
  },
);

const SignUpMagicLinkAlert = memo(
  ({
    formError,
    magicSent,
  }: {
    formError: string | null;
    magicSent: boolean;
  }) => {
    return (
      <>
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
      </>
    );
  },
);

export default SignUpMagicLink;
