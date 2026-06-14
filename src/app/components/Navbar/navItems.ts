import {
  IconCalendar,
  IconChecklist,
  IconClock,
  IconDashboard,
  IconMessage,
  IconNetwork,
  IconPlugConnected,
  IconShare,
  IconTags,
} from "@tabler/icons-react";

export interface NavItem {
  icon: typeof IconDashboard;
  label: string;
  to: string;
}

// Shared by the desktop icon rail (Navbar) and the mobile drawer (MobileNav).
export const navItems: NavItem[] = [
  { icon: IconDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: IconCalendar, label: "Schedule", to: "/schedule" },
  { icon: IconClock, label: "Timer", to: "/timer" },
  { icon: IconChecklist, label: "Tasks", to: "/tasks" },
  { icon: IconTags, label: "Tags", to: "/tags" },
  { icon: IconPlugConnected, label: "Integrations", to: "/integrations" },
  { icon: IconMessage, label: "Messages", to: "/messages" },
  { icon: IconNetwork, label: "Network", to: "/network" },
  { icon: IconShare, label: "Public Views", to: "/public-views" },
];
