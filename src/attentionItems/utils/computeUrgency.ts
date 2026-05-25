import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { AttentionUrgency } from "@/attentionItems/models/urgency";
import type { TagAnswerMode } from "@/tags/models/tag";

const MS_PER_MIN = 60_000;
const MS_PER_HOUR = 3_600_000;

export interface UrgencyContext {
  now: Date;
  currentTimeblockTagIds: ReadonlySet<string>;
  tagAnswerModes: ReadonlyMap<string, TagAnswerMode>;
}

export function computeUrgency(
  item: AttentionItemDto,
  ctx: UrgencyContext,
): AttentionUrgency {
  const due = item.dueDate ? new Date(item.dueDate) : null;

  if (due && due.getTime() < ctx.now.getTime()) return "overdue";

  const hasImmediateTag = item.tagIds.some(
    (id) => ctx.tagAnswerModes.get(id) === "immediately",
  );
  const hasTimeblockTag = item.tagIds.some(
    (id) => ctx.tagAnswerModes.get(id) === "timeblock",
  );
  const fitsCurrentTimeblock = item.tagIds.some((id) =>
    ctx.currentTimeblockTagIds.has(id),
  );

  if (hasImmediateTag && due) {
    const minsUntil = (due.getTime() - ctx.now.getTime()) / MS_PER_MIN;
    if (minsUntil <= 30) return "urgent";
  }

  if (hasTimeblockTag && fitsCurrentTimeblock) return "now";

  if (due) {
    const hoursUntil = (due.getTime() - ctx.now.getTime()) / MS_PER_HOUR;
    if (hoursUntil <= 24) {
      if (hasImmediateTag) return "upcoming";
      if (hasTimeblockTag && !fitsCurrentTimeblock) return "upcoming";
    }
  }

  return "later";
}
