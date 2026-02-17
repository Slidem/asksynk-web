import { Alert } from "@mantine/core";
import { memo } from "react";

interface Props {
  formError: string | null;
  magicSent: boolean;
}

const SignUpAlert = ({ formError, magicSent }: Props) => {
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
};

export default memo(SignUpAlert);
