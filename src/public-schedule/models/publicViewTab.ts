export type PublicViewTab = "calendar" | "pending" | "messages";

export const PUBLIC_VIEW_TABS: PublicViewTab[] = [
  "calendar",
  "pending",
  "messages",
];

export const DEFAULT_PUBLIC_VIEW_TAB: PublicViewTab = "calendar";

export function isPublicViewTab(value: unknown): value is PublicViewTab {
  return (
    value === "calendar" || value === "pending" || value === "messages"
  );
}
