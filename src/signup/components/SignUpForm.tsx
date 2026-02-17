import { PasswordInput, Stack, TextInput } from "@mantine/core";
import { memo } from "react";

interface SignUpValues {
  email: string;
  password: string;
  name: string;
}

interface Props {
  isMagicMode: boolean;
  values: SignUpValues;
  setValues: React.Dispatch<React.SetStateAction<SignUpValues>>;
}

const SignUpForm = ({ isMagicMode, values, setValues }: Props) => {
  return (
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
    </Stack>
  );
};

export default memo(SignUpForm);
