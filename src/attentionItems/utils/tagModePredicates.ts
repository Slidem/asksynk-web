import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import type { TagAnswerMode } from "@/tags/models/tag";

export interface UrgencyContext {
  now: Date;
  currentTimeblockTagIds: ReadonlySet<string>;
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
