import { TagsPage } from "@/tags/components/TagsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tags")({
  component: TagsPage,
});
