import { Anchor, Group, Text } from "@mantine/core";

import { memo } from "react";

interface Props {
  redirectTo: string;
}

const SignUpSignInCTA = ({ redirectTo }: Props) => {
  return (
    <Group justify="center" gap="xs">
      <Text size="sm" c="dimmed">
        Already have an account?
      </Text>
      <Anchor href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}>
        Sign in
      </Anchor>
    </Group>
  );
};

export default memo(SignUpSignInCTA);
