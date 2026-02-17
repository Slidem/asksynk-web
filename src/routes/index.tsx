import { Box, Stack } from "@mantine/core";

import { CTASection } from "@/landing/components/CTASection";
import { FeaturesSection } from "@/landing/components/FeaturesSection";
import { Footer } from "@/landing/components/Footer";
import { Header } from "@/landing/components/Header";
import { HeroSection } from "@/landing/components/HeroSection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <Stack gap={0}>
      <Header />
      <Box flex={1}>
        <Stack gap="xl">
          <HeroSection />
          <FeaturesSection />
          <CTASection />
        </Stack>
      </Box>
      <Footer />
    </Stack>
  );
}
