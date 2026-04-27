export interface PublicViewDto {
  id: string;
  slug: string;
  name: string | null;
  url: string;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  guestCount?: number;
}

export interface CreatePublicViewInput {
  name?: string;
  expiresAt?: string;
}
