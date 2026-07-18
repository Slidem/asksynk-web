import { Alert, Stack, TextInput } from "@mantine/core";
import { memo, useCallback, useState } from "react";

import SignInFormContainer from "./SignInFormContainer";
import { authClient } from "@/auth";
import { useSearch } from "@tanstack/react-router";

interface Props {
  setMode: (mode: "password" | "magic") => void;
}

const MagicLink = ({ setMode }: Props) => {
  const { redirect: redirectTo } = useSearch({
    from: "/signin",
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setFormError(null);
      setMagicSent(false);
      setIsSubmitting(true);

      try {
        const { error } = await authClient.signIn.magicLink({
          email,
          name: name || undefined,
          callbackURL: `${window.location.origin}${redirectTo || "/dashboard"}`,
        });
        if (error) {
          setFormError(error.message || "");
          return;
        }
        setMagicSent(true);
      } catch (e) {
        console.error(e);
        setFormError("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, name, redirectTo],
  );

  const renderAlert = useCallback(
    () => <MagicLinkAlert formError={formError} magicSent={magicSent} />,
    [formError, magicSent],
  );

  const renderForm = useCallback(
    () => (
      <MagicLinkForm
        email={email}
        setEmail={setEmail}
        name={name}
        setName={setName}
      />
    ),
    [email, name],
  );

  return (
    <SignInFormContainer
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

const MagicLinkForm = memo(
  ({
    email,
    setEmail,
    name,
    setName,
  }: {
    email: string;
    setEmail: (email: string) => void;
    name: string;
    setName: (name: string) => void;
  }) => {
    return (
      <Stack gap="sm">
        <TextInput
          label="Email"
          placeholder="Your email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
        />
        <TextInput
          label="Name"
          description="Used if this is your first sign in."
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
      </Stack>
    );
  },
);

const MagicLinkAlert = memo(
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
            Check your email for a sign in link.
          </Alert>
        ) : null}
      </>
    );
  },
);

export default MagicLink;
