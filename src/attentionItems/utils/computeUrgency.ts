import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { AttentionUrgency } from "@/attentionItems/models/urgency";
import {
  fitsCurrentTimeblock,
  hasImmediateTag,
  hasTimeblockTag,
  type UrgencyContext,
} from "@/attentionItems/utils/tagModePredicates";

export type { UrgencyContext };

const MS_PER_MIN = 60_000;
const MS_PER_HOUR = 3_600_000;

export function computeUrgency(
  item: AttentionItemDto,
  ctx: UrgencyContext,
): AttentionUrgency {
  if (item.status === "resolved") return "resolved";

  const due = item.dueDate ? new Date(item.dueDate) : null;

  const immediate = hasImmediateTag(item, ctx.tagAnswerModes);
  const timeblock = hasTimeblockTag(item, ctx.tagAnswerModes);
  const fits = fitsCurrentTimeblock(item, ctx.currentTimeblockTagIds);

  if (timeblock && fits) return "now";

  if (due && due.getTime() < ctx.now.getTime()) return "overdue";

  if (immediate && due) {
    const minsUntil = (due.getTime() - ctx.now.getTime()) / MS_PER_MIN;
    if (minsUntil <= 30) return "urgent";
  }

  if (due) {
    const hoursUntil = (due.getTime() - ctx.now.getTime()) / MS_PER_HOUR;
    if (hoursUntil <= 24) {
      if (immediate) return "upcoming";
      if (timeblock && !fits) return "upcoming";
    }
  }

  return "later";
}
