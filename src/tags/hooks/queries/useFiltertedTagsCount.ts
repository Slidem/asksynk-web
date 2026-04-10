import { useFilteredTags } from "./useFilteredTags";

export const useFilteredTagsCount = () => {
  const { data: tagCount } = useFilteredTags((tags) => tags.length);
  return tagCount ?? 0;
};
