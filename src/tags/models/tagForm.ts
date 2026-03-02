import type { ResponseTimeUnit } from "@/tags/utils/responseTime";
import type { TagAnswerMode } from "@/tags/models/tag";

export interface TagFormValues {
  name: string;
  description: string;
  color: string;
  answerMode: TagAnswerMode;
  responseValue: number;
  responseUnit: ResponseTimeUnit;
  browserNotificationEnabled: boolean;
  soundNotificationEnabled: boolean;
}

export const DEFAULT_TAG_FORM_VALUES: TagFormValues = {
  name: "",
  description: "",
  color: "#4ac26b",
  answerMode: "timeblock",
  responseValue: 30,
  responseUnit: "minutes",
  browserNotificationEnabled: true,
  soundNotificationEnabled: true,
};
