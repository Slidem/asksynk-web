import {
  Alert,
  Anchor,
  Paper,
  Stack,
  Text,
  TextInput,
  alpha,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { memo, useCallback, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import SignInFormContainer from "./SignInFormContainer";
import { authClient } from "@/auth";

interface Props {
  setMode: (mode: "password" | "magic") => void;
}

const UserPass = ({ setMode }: Props) => {
  const navigate = useNavigate();
  const { redirect: redirectTo, verified } = useSearch({
    from: "/signin",
  });
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formErrorCode, setFormErrorCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setFormError(null);
      setFormErrorCode(null);
      setIsSubmitting(true);

      try {
        const { error, data } = await authClient.signIn.email({
          email,
          password,
          callbackURL: redirectTo || "/dashboard",
        });
        if (error) {
          setFormError(error.message || "");
          setFormErrorCode((error as { code?: string }).code || null);
          return;
        }

        if (data?.user?.emailVerified) {
          navigate({ to: redirectTo || "/dashboard" });
        } else {
          navigate({ to: `/verify-email`, search: { redirect: redirectTo } });
        }
      } catch (e) {
        console.error(e);
        setFormError("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, redirectTo, navigate],
  );

  const renderAlert = useCallback(
    () => (
      <UserPassAlert
        formError={formError}
        formErrorCode={formErrorCode}
        redirectTo={redirectTo || "/dashboard"}
        verified={!!verified}
      />
    ),
    [formError, formErrorCode, redirectTo, verified],
  );

  const renderForm = useCallback(
    () => (
      <UserPassForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    ),
    [email, password],
  );

  return (
    <SignInFormContainer
      mode="password"
      setMode={setMode}
      renderAlert={renderAlert}
      renderForm={renderForm}
      submitLabel="Sign in"
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
    />
  );
};

const UserPassForm = memo(
  ({
    email,
    setEmail,
    password,
    setPassword,
  }: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
  }) => {
    return (
      <Stack gap="sm">
        <TextInput
          label="Email"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
        />
        <TextInput
          label="Password"
          placeholder="Your password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
        />
      </Stack>
    );
  },
);

const UserPassAlert = memo(
  ({
    formError,
    formErrorCode,
    redirectTo,
    verified,
  }: {
    formError: string | null;
    formErrorCode: string | null;
    redirectTo: string;
    verified: boolean;
  }) => {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const normalizedError = formError?.toLowerCase() || "";
    const isUnverifiedError =
      formErrorCode === "EMAIL_NOT_VERIFIED" ||
      normalizedError.includes("verify") ||
      normalizedError.includes("verified") ||
      false;

    return (
      <>
        {formError ? (
          isUnverifiedError ? (
            <Paper
              radius="md"
              p="md"
              style={{
                background:
                  colorScheme === "dark"
                    ? `linear-gradient(135deg, ${alpha(
                        theme.colors.yellow[9],
                        0.32,
                      )}, ${alpha(theme.colors.yellow[8], 0.2)})`
                    : `linear-gradient(135deg, ${alpha(
                        theme.colors.yellow[0],
                        0.98,
                      )}, ${alpha(theme.colors.yellow[2], 0.88)})`,
                border:
                  colorScheme === "dark"
                    ? `1px solid ${alpha(theme.colors.yellow[6], 0.5)}`
                    : `1px solid ${alpha(theme.colors.yellow[4], 0.5)}`,
                boxShadow:
                  colorScheme === "dark"
                    ? `0 12px 28px ${alpha(theme.colors.yellow[9], 0.35)}`
                    : `0 12px 28px ${alpha(theme.colors.yellow[7], 0.18)}`,
              }}
            >
              <Stack gap={6}>
                <Text
                  fw={600}
                  size="sm"
                  c={colorScheme === "dark" ? "yellow.1" : "dark"}
                >
                  Email not verified
                </Text>
                <Text
                  size="sm"
                  c={colorScheme === "dark" ? "yellow.1" : "dimmed"}
                >
                  This account needs a verified email before sign in is allowed.
                </Text>
                <Text
                  size="sm"
                  c={colorScheme === "dark" ? "yellow.1" : "dimmed"}
                >
                  Check your inbox for the verification link, then return here
                  to sign in. If it is missing, check spam or search for
                  "asksynk".
                </Text>
                <Anchor
                  size="sm"
                  fw={500}
                  c={colorScheme === "dark" ? "yellow.0" : "yellow.9"}
                  href={`/verify-email?redirect=${encodeURIComponent(
                    redirectTo,
                  )}`}
                >
                  Go to email verification steps
                </Anchor>
              </Stack>
            </Paper>
          ) : (
            <Alert color="red" variant="light">
              {formError}
            </Alert>
          )
        ) : null}

        {verified ? (
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
      </>
    );
  },
);

export default UserPass;
