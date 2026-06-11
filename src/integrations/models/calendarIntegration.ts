export type IntegrationStatus = "active" | "error" | "revoked";

export type SyncDirection = "readonly" | "bidirectional";

export interface ProviderCalendarDto {
  id: string;
  name: string | null;
  color: string | null;
  externalId: string;
  syncEnabled: boolean;
}

export interface CalendarIntegrationDto {
  id: string;
  provider: string;
  status: IntegrationStatus;
  syncDirection: SyncDirection;
  accountEmail: string | null;
  lastError: string | null;
  calendars: ProviderCalendarDto[];
}

export interface AuthUrlResponse {
  url: string;
}

export interface UpdateIntegrationInput {
  syncDirection?: SyncDirection;
  calendars?: { calendarId: string; syncEnabled: boolean }[];
}
