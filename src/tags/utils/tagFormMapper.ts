import {
  responseTimeToMillis,
  responseTimeToUnit,
} from "@/tags/utils/responseTime";

import type { TagDto } from "@/tags/models/tag";
import type { TagFormValues } from "@/tags/models/tagForm";
import { createTempId } from "@/lib/id";

export function tagDtoToFormValues(tag: TagDto): TagFormValues {
  const rtMillis =
    tag.answerMode.type === "immediately"
      ? tag.answerMode.responseTimeMillis
      : 0;
  const rt = responseTimeToUnit(rtMillis);
  return {
    name: tag.name,
    description: tag.description ?? "",
    color: tag.color,
    answerMode: tag.answerMode.type,
    responseValue: rt.value,
    responseUnit: rt.unit,
    browserNotificationEnabled:
      tag.notificationsSettings.browserNotificationEnabled,
    soundNotificationEnabled:
      tag.notificationsSettings.soundNotificationEnabled,
  };
}

export function tagFormValuesToInput(values: TagFormValues) {
  return {
    tempId: createTempId(),
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    color: values.color,
    answerMode:
      values.answerMode === "immediately"
        ? {
            type: "immediately" as const,
            responseTimeMillis: responseTimeToMillis(
              values.responseValue,
              values.responseUnit,
            ),
          }
        : { type: "timeblock" as const },
    notificationsSettings: {
      browserNotificationEnabled: values.browserNotificationEnabled,
      soundNotificationEnabled: values.soundNotificationEnabled,
    },
  };
}
