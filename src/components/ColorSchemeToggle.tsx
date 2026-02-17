import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="subtle"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === "light" ? (
        <IconMoon stroke={1.5} />
      ) : (
        <IconSun stroke={1.5} />
      )}
    </ActionIcon>
  );
}
