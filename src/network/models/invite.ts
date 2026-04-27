export type InviteStatus = "pending" | "accepted" | "rejected";

export interface InviteDto {
  id: string;
  inviterUserId: string;
  inviteeEmail: string;
  status: InviteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInviteInput {
  email: string;
}
