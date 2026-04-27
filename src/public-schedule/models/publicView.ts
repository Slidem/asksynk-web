export interface PublicViewMetadataDto {
  slug: string;
  name: string | null;
  ownerUserId: string;
  expiresAt: string;
}

export interface GuestSignInInput {
  displayName: string;
}

export interface GuestSignInResult {
  guestId: string;
  token: string;
  expiresAt: string;
  publicViewId: string;
  publicViewOwnerId: string;
}

export interface PublicMeDto {
  guestId: string;
  displayName: string;
  publicViewId: string;
  publicViewOwnerId: string;
  expiresAt: string;
}
