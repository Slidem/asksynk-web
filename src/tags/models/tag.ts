export type TagAnswerMode = "timeblock" | "immediately";

export interface TagNotificationSettings {
  browserNotificationEnabled: boolean;
  soundNotificationEnabled: boolean;
}

export interface TagDto {
  id: string;
  name: string;
  userId: string;
  description?: string;
  color: string;
  answerMode: TagAnswerMode;
  responseTimeMillis: number;
  notificationsSettings: TagNotificationSettings;
}

export interface TagCreateInput {
  name: string;
  description?: string;
  color: string;
  answerMode: TagAnswerMode;
  responseTimeMillis: number;
  notificationsSettings: TagNotificationSettings;
}

export interface TagUpdateInput {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  answerMode?: TagAnswerMode;
  responseTimeMillis?: number;
  notificationsSettings?: TagNotificationSettings;
}
