import {
  IconBrandGoogle,
  IconBrandSlack,
  IconBrandWindows,
  IconMail,
  type Icon,
} from "@tabler/icons-react";

export type IntegrationProviderKind = "calendar" | "messaging";

export interface IntegrationProvider {
  id: string;
  label: string;
  description: string;
  icon: Icon;
  kind: IntegrationProviderKind;
  available: boolean;
}

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
  {
    id: "google",
    label: "Google Calendar",
    description: "Import your Google calendars and optionally mirror events back.",
    icon: IconBrandGoogle,
    kind: "calendar",
    available: true,
  },
  {
    id: "outlook",
    label: "Outlook Calendar",
    description: "Sync your Outlook calendars.",
    icon: IconBrandWindows,
    kind: "calendar",
    available: false,
  },
  {
    id: "gmail",
    label: "Gmail",
    description: "Triage incoming email through tags.",
    icon: IconMail,
    kind: "messaging",
    available: false,
  },
  {
    id: "slack",
    label: "Slack",
    description: "Bring Slack messages into your schedule.",
    icon: IconBrandSlack,
    kind: "messaging",
    available: false,
  },
];

export function getProvider(id: string): IntegrationProvider | undefined {
  return INTEGRATION_PROVIDERS.find((p) => p.id === id);
}

export function isCalendarProvider(id: string): boolean {
  return getProvider(id)?.kind === "calendar";
}
