import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/messages/components/MessagesPage";

export const Route = createFileRoute("/_authenticated/messages")({
  component: MessagesPage,
});
