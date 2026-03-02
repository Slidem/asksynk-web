export type TagAnswerMode = "timeblock" | "immediately";

export interface AnswerModeImmediate {
  type: "immediately";
  responseTimeMillis: number;
}

export interface AnswerModeTimeblock {
  type: "timeblock";
}

export type TagAnswerModeObj = AnswerModeImmediate | AnswerModeTimeblock;

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
  answerMode: TagAnswerModeObj;
  notificationsSettings: TagNotificationSettings;
}

export interface TagCreateInput {
  tempId: string;
  name: string;
  description?: string;
  color: string;
  answerMode: TagAnswerModeObj;
  notificationsSettings: TagNotificationSettings;
}

export interface TagUpdateInput {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  answerMode?: TagAnswerModeObj;
  notificationsSettings?: TagNotificationSettings;
}
