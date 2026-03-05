import type { TagAnswerMode } from "./tag";

export const DEFAULT_FILTERS: TagsFilters = {
  answerMode: "all",
  orderBy: "createdAt",
  orderDirection: "desc",
  search: "",
  limit: 20,
  offset: 0,
};

export type TagAnserModeFilterValue = TagAnswerMode | "all";

export type OrderByFilterValue = "createdAt" | "updatedAt";

export type OrderDirectionFilterValue = "asc" | "desc";

export interface TagsFilters {
  answerMode?: TagAnserModeFilterValue;
  orderBy?: OrderByFilterValue;
  orderDirection?: OrderDirectionFilterValue;
  search?: string;
  limit?: number;
  offset?: number;
}
