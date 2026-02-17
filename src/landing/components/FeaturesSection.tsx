import {
  Container,
  Grid,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconMessages,
  IconBellOff,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconCalendarTime,
    title: "Custom Time Blocks",
    description:
      "Tag your time, control your schedule. Create focused blocks for deep work, communication, and breaks.",
  },
  {
    icon: IconMessages,
    title: "Smart Communication Routing",
    description:
      "Emails, Slack, WhatsApp - all tagged and routed. Respond during appropriate time blocks, not when they arrive.",
  },
  {
    icon: IconBellOff,
    title: "Notification Barriers",
    description:
      "Filter noise by tag. Only notifications that match your current focus block get through. Stay in flow.",
  },
];

export function FeaturesSection() {
  return (
    <Container size="lg" py="xl" id="features">
      <Stack align="center" gap="xl">
        <Stack gap="xs" ta="center">
          <Title order={2}>Built for Focus</Title>
          <Text c="dimmed" maw={400}>
            Everything you need to control your attention in an always-on world.
          </Text>
        </Stack>

        <Grid gutter="xl">
          {features.map((feature) => (
            <Grid.Col key={feature.title} span={{ base: 12, sm: 4 }}>
              <Paper p="lg" h="100%">
                <Stack gap="md" align="center" ta="center">
                  <ThemeIcon size={48} radius="md" variant="light">
                    <feature.icon size={24} stroke={1.5} />
                  </ThemeIcon>
                  <Stack gap="xs">
                    <Text fw={600} size="lg">
                      {feature.title}
                    </Text>
                    <Text c="dimmed" size="sm">
                      {feature.description}
                    </Text>
                  </Stack>
                </Stack>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
