export interface ProfileAvatar {
  id: string;
  url: string;
}

export interface ProfileDto {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  avatar: ProfileAvatar | null;
}

export interface ProfileUpdateInput {
  phone?: string | null;
  avatarAttachmentId?: string | null;
}
