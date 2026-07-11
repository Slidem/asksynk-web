import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { TagAnswerMode } from "@/tags/models/tag";

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface UrgencyContext {
  now: Date;
  currentTimeblockTagIds: ReadonlySet<string>;
  currentTimeblocks: readonly TimeRange[];
  tagAnswerModes: ReadonlyMap<string, TagAnswerMode>;
}

export function hasImmediateTag(
  item: AttentionItemDto,
  tagAnswerModes: ReadonlyMap<string, TagAnswerMode>,
): boolean {
  return item.tagIds.some((id) => tagAnswerModes.get(id) === "immediately");
}

export function hasTimeblockTag(
  item: AttentionItemDto,
  tagAnswerModes: ReadonlyMap<string, TagAnswerMode>,
): boolean {
  return item.tagIds.some((id) => tagAnswerModes.get(id) === "timeblock");
}

export function fitsCurrentTimeblock(
  item: AttentionItemDto,
  currentTimeblockTagIds: ReadonlySet<string>,
): boolean {
  return item.tagIds.some((id) => currentTimeblockTagIds.has(id));
}

// True when a due time falls inside an active timeblock — a due-dated item is
// actionable "now" while you're in the block it's due in, until that block ends.
export function dueWithinActiveTimeblock(
  due: Date,
  currentTimeblocks: readonly TimeRange[],
): boolean {
  const t = due.getTime();
  return currentTimeblocks.some(
    (b) => b.start.getTime() <= t && t < b.end.getTime(),
  );
}

/**
 * Should an incoming item alert NOW? Urgent ("immediately") tags take
 * precedence and always alert; timeblock tags alert only when the item fits
 * the active timeblock. Everything else stays silent (list-only).
 */
export function shouldNotifyAttentionItem(
  item: AttentionItemDto,
  ctx: UrgencyContext,
): boolean {
  if (item.status === "resolved") return false;
  if (hasImmediateTag(item, ctx.tagAnswerModes)) return true;
  return (
    hasTimeblockTag(item, ctx.tagAnswerModes) &&
    fitsCurrentTimeblock(item, ctx.currentTimeblockTagIds)
  );
}
