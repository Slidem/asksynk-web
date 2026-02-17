import { Anchor, Group, Text } from "@mantine/core";

import { useSearch } from "@tanstack/react-router";

const SignInCreateAccountCTA = () => {
  const { redirect: redirectTo } = useSearch({
    from: "/signin",
  });

  return (
    <Group justify="center" gap="xs">
      <Text size="sm" c="dimmed">
        New here?
      </Text>
      <Anchor
        href={`/signup?redirect=${encodeURIComponent(redirectTo || "/dashboard")}`}
      >
        Create an account
      </Anchor>
    </Group>
  );
};

export default SignInCreateAccountCTA;
