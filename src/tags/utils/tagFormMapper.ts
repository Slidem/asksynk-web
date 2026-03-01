import {
  responseTimeToMillis,
  responseTimeToUnit,
} from "@/tags/utils/responseTime";

import type { TagDto } from "@/tags/models/tag";
import type { TagFormValues } from "@/tags/models/tagForm";
import { createTempId } from "@/lib/id";

export function tagDtoToFormValues(tag: TagDto): TagFormValues {
  const rt = responseTimeToUnit(tag.responseTimeMillis);
  return {
    name: tag.name,
    description: tag.description ?? "",
    color: tag.color,
    answerMode: tag.answerMode,
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
    answerMode: values.answerMode,
    responseTimeMillis: responseTimeToMillis(
      values.responseValue,
      values.responseUnit,
    ),
    notificationsSettings: {
      browserNotificationEnabled: values.browserNotificationEnabled,
      soundNotificationEnabled: values.soundNotificationEnabled,
    },
  };
}
